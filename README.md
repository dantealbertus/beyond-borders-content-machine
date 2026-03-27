# Beyond Borders — Content Machine

Dark luxury content intelligence dashboard voor Bali vastgoed investment adviseurs.

## Features

| Sectie | Beschrijving |
|--------|-------------|
| 📰 **Nieuws** | Claude web search → recente Bali vastgoed artikelen, AI samenvatting + content haak |
| 📊 **Trends** | Trending Instagram hashtags met engagement angles + example hooks |
| 📸 **Instagram** | Apify scraper → high-engagement posts gefilterd op score |
| 💡 **Ideeënboard** | Opslaan, taggen, status bijhouden + AI caption generator |

## Stack

```
backend/    Python 3.11 + FastAPI + httpx
frontend/   React 18 + CSS Modules
hosting:    Railway (beide services)
AI:         Claude claude-sonnet-4-20250514 (web search + caption generation)
scraping:   Apify instagram-hashtag-scraper
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env        # vul ANTHROPIC_API_KEY en APIFY_API_KEY in
pip install -r requirements.txt
uvicorn main:app --reload   # start op localhost:8000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # vul REACT_APP_API_URL in (of laat localhost staan voor dev)
npm install
npm start                   # start op localhost:3000
```

### 3. Railway deployment

**Backend service:**
1. Nieuwe Railway service → link je `backend/` folder
2. Environment variables toevoegen:
   - `ANTHROPIC_API_KEY` = jouw Anthropic key
   - `APIFY_API_KEY` = jouw Apify key
   - `PORT` = 8000
3. Railway pakt `railway.toml` automatisch op

**Frontend service:**
1. Nieuwe Railway service → link je `frontend/` folder
2. Environment variable:
   - `REACT_APP_API_URL` = de Railway URL van je backend (bijv. `https://content-machine-api.railway.app`)
3. Deploy → Railway bouwt React build automatisch

## API Endpoints

| Method | Path | Beschrijving |
|--------|------|-------------|
| `GET` | `/health` | Healthcheck |
| `GET` | `/api/news` | Nieuws + AI samenvatting |
| `GET` | `/api/trends` | Hashtag trends |
| `GET` | `/api/instagram` | Instagram posts via Apify |
| `POST` | `/api/generate-caption` | AI caption generator |

### Caption generator body
```json
{
  "topic": "Waarom Tabanan de beste Bali investment is in 2025",
  "style": "educatief",
  "language": "nl"
}
```

## Fase roadmap

- [x] **Fase 1** — Nieuws + trends (Claude web search)
- [x] **Fase 2** — Instagram via Apify
- [x] **Fase 3** — Caption generator + ideeënboard
- [ ] **Fase 4** — Automatische dagelijkse digest via cron job
- [ ] **Fase 5** — Direct posten naar Instagram via Meta API
- [ ] **Fase 6** — Performance tracking (welke posts doen het goed)

## Apify instellen

1. Maak een account op [apify.com](https://apify.com)
2. Ga naar Settings → Integrations → API tokens
3. Kopieer je token naar `APIFY_API_KEY`
4. De app gebruikt `apify~instagram-hashtag-scraper` (gratis tier: 5 runs/maand)

Voor meer runs: upgrade naar Apify starter (~$5/maand) of gebruik de `apify~instagram-search-scraper` actor.
