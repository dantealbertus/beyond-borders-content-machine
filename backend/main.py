from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
import httpx
import os
import json
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Content Machine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
APIFY_API_KEY = os.getenv("APIFY_API_KEY", "")

# ── Models ──────────────────────────────────────────────────────────────────

class SaveIdeaRequest(BaseModel):
    title: str
    content: str
    source: str
    source_url: Optional[str] = None
    tags: list[str] = []

# ── Helpers ─────────────────────────────────────────────────────────────────

async def claude_complete(system: str, user: str, max_tokens: int = 1500) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": max_tokens,
                "system": system,
                "messages": [{"role": "user", "content": user}],
                "tools": [{"type": "web_search_20250305", "name": "web_search"}],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        texts = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
        return "\n".join(texts)


async def claude_json(system: str, user: str, max_tokens: int = 2000) -> Union[dict, list]:
    """Claude call that returns parsed JSON — no web search needed."""
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": max_tokens,
                "system": system,
                "messages": [{"role": "user", "content": user}],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        text = next(
            (b["text"] for b in data.get("content", []) if b.get("type") == "text"), ""
        )
        clean = text.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return json.loads(clean)

# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/news")
async def get_news(
    query: str = "Bali vastgoed villa investment",
    num_results: int = 5,
    days: int = 30,
):
    """Fetch and summarise news articles based on search params."""
    system = f"""You are a content researcher for a Bali real estate investment advisor.
Search the web for the {num_results} most recent and relevant news articles about: {query}
Only include articles from the last {days} days.

Return ONLY a JSON array with this exact structure, no markdown, no preamble:
[
  {{
    "title": "Article title",
    "summary": "2-3 sentence summary in Dutch",
    "source": "Publication name",
    "url": "https://...",
    "date": "2025-01-15",
    "relevance_score": 85,
    "key_insight": "One-line takeaway for content creators"
  }}
]"""

    try:
        result = await claude_complete(system, f"Search for the latest news about: {query}")
        clean = result.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        start = clean.find("[")
        end = clean.rfind("]") + 1
        articles = json.loads(clean[start:end])
        return {"data": articles, "fetched_at": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(500, f"News fetch failed: {str(e)}")


def _apply_post_filters(item, cutoff, min_likes, min_engagement, keyword, source_label):
    """Shared post-processing filter. Returns dict or None."""
    likes = item.get("likesCount", 0) or 0
    comments = item.get("commentsCount", 0) or 0
    engagement = likes + comments * 3
    ts = item.get("timestamp", "")

    if cutoff and ts:
        try:
            post_dt = datetime.fromisoformat(ts.replace("Z", "+00:00")).replace(tzinfo=None)
            if post_dt < cutoff:
                return None
        except Exception:
            pass

    if likes < min_likes or engagement < min_engagement:
        return None

    caption = (item.get("caption") or "").lower()
    if keyword and keyword.lower() not in caption:
        return None

    return {
        "id": item.get("id", ""),
        "caption": (item.get("caption") or "")[:200],
        "likes": likes,
        "comments": comments,
        "url": item.get("url", ""),
        "image_url": item.get("displayUrl", ""),
        "owner": item.get("ownerUsername", ""),
        "timestamp": ts,
        "source_label": source_label,
        "engagement_score": engagement,
    }


async def _poll_run(client, run_id, max_polls=24):
    for _ in range(max_polls):
        await asyncio.sleep(5)
        resp = await client.get(
            f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_API_KEY}"
        )
        if resp.json().get("data", {}).get("status") == "SUCCEEDED":
            return True
    return False


@app.get("/api/instagram")
async def get_instagram_posts(
    mode: str = "hashtag",
    hashtags: str = "balivillasinvestment,balirealestate",
    usernames: str = "",
    days: int = 30,
    min_likes: int = 0,
    min_engagement: int = 0,
    max_results: int = 25,
    keyword: str = "",
):
    """Scrape Instagram posts via Apify — hashtag or creator mode."""
    if not APIFY_API_KEY:
        raise HTTPException(400, "APIFY_API_KEY not configured")

    results_limit = max(max_results, 10)
    cutoff = datetime.utcnow() - timedelta(days=days) if days > 0 else None
    all_posts = []

    async with httpx.AsyncClient(timeout=240) as client:

        if mode == "creator":
            username_list = [u.strip().lstrip("@") for u in usernames.split(",") if u.strip()]
            if not username_list:
                raise HTTPException(400, "Vul minimaal één gebruikersnaam in")

            for username in username_list[:5]:
                try:
                    run_resp = await client.post(
                        f"https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token={APIFY_API_KEY}",
                        json={"usernames": [username], "resultsLimit": results_limit},
                    )
                    run_data = run_resp.json()
                    run_id = run_data.get("data", {}).get("id")
                    if not run_id:
                        continue
                    await _poll_run(client, run_id)
                    dataset_id = run_data["data"].get("defaultDatasetId")
                    if not dataset_id:
                        continue
                    items_resp = await client.get(
                        f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_API_KEY}&limit={results_limit}"
                    )
                    # Profile scraper returns nested latestPosts
                    for profile in items_resp.json():
                        for item in (profile.get("latestPosts") or []):
                            item.setdefault("ownerUsername", username)
                            post = _apply_post_filters(item, cutoff, min_likes, min_engagement, keyword, f"@{username}")
                            if post:
                                all_posts.append(post)
                except Exception:
                    continue

        else:  # hashtag mode
            hashtag_list = [h.strip().replace(" ", "").replace("#", "") for h in hashtags.split(",") if h.strip()]
            if not hashtag_list and keyword:
                hashtag_list = [keyword.strip().replace(" ", "").replace("#", "")]
            elif not hashtag_list:
                raise HTTPException(400, "Selecteer minimaal één hashtag of vul een onderwerp in")

            for hashtag in hashtag_list[:3]:
                try:
                    run_resp = await client.post(
                        f"https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs?token={APIFY_API_KEY}",
                        json={"hashtags": [hashtag], "resultsLimit": results_limit},
                    )
                    run_data = run_resp.json()
                    run_id = run_data.get("data", {}).get("id")
                    if not run_id:
                        continue
                    await _poll_run(client, run_id)
                    dataset_id = run_data["data"].get("defaultDatasetId")
                    if not dataset_id:
                        continue
                    items_resp = await client.get(
                        f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_API_KEY}&limit={results_limit}"
                    )
                    for item in items_resp.json():
                        post = _apply_post_filters(item, cutoff, min_likes, min_engagement, keyword, f"#{hashtag}")
                        if post:
                            all_posts.append(post)
                except Exception:
                    continue

    all_posts.sort(key=lambda x: x["engagement_score"], reverse=True)
    return {"data": all_posts[:50], "fetched_at": datetime.utcnow().isoformat()}


@app.post("/api/generate-caption")
async def generate_caption(payload: dict):
    """Generate an Instagram caption based on a news item or idea."""
    topic = payload.get("topic", "")
    style = payload.get("style", "educatief")  # educatief | inspirerend | cijfers
    language = payload.get("language", "nl")

    system = f"""Je bent een social media expert voor een Bali vastgoed investment adviseur 
die Nederlandse ondernemers begeleidt bij het investeren in villa's op Bali.

Schrijf een Instagram caption die:
- Begint met een sterke hook (eerste zin trekt direct aandacht)
- Stijl: {style}
- Taal: {'Nederlands' if language == 'nl' else 'Engels'}
- 150-250 woorden
- Eindigt met een duidelijke call-to-action
- 5-8 relevante hashtags onderaan
- Geen generieke AI-taal, schrijf als een echte ondernemer die dit zelf heeft meegemaakt

Return ONLY JSON: {{"caption": "...", "hashtags": ["#...", "..."], "hook": "eerste zin"}}"""

    try:
        result = await claude_json(system, f"Schrijf een caption over: {topic}")
        return {"data": result}
    except Exception as e:
        raise HTTPException(500, f"Caption generation failed: {str(e)}")
