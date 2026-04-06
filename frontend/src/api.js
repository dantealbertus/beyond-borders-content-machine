const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  news: ({ query, numResults, days } = {}) => {
    const params = new URLSearchParams({
      query: query || 'Bali vastgoed villa investment',
      num_results: numResults || 5,
      days: days ?? 30,
    });
    return get(`/api/news?${params}`);
  },
  trends:         () => get('/api/trends'),
  instagram: ({ mode, hashtags, usernames, days, minLikes, minEngagement, maxResults, keyword }) => {
    const params = new URLSearchParams({
      mode: mode || 'hashtag',
      hashtags: hashtags || '',
      usernames: usernames || '',
      days,
      min_likes: minLikes,
      min_engagement: minEngagement,
      max_results: maxResults,
      keyword: keyword || '',
    });
    return get(`/api/instagram?${params}`);
  },
  generateContent: (topic, platform, contentType, extraContext) =>
    post('/api/generate-content', {
      topic,
      platform,
      content_type: contentType,
      extra_context: extraContext,
    }),
};
