import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './api';
import { useIdeas } from './useIdeas';
import { usePosts } from './usePosts';
import styles from './App.module.css';

// ── Small UI atoms ───────────────────────────────────────────────────────────

function Spinner() {
  return <span className={styles.spinner} aria-label="laden" />;
}

function Badge({ children, color = 'gold' }) {
  return <span className={`${styles.badge} ${styles['badge_' + color]}`}>{children}</span>;
}

function StatusDot({ status }) {
  const map = { rising: 'green', stable: 'gold', declining: 'red' };
  return <span className={`${styles.dot} ${styles['dot_' + (map[status] || 'gold')]}`} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button className={styles.iconBtn} onClick={copy} title="Kopieer">
      {copied ? '✓' : '⎘'}
    </button>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon, children, onRefresh, loading, lastFetched }) {
  return (
    <section className={`${styles.section} ${styles.sectionActive}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {lastFetched && (
          <span className={styles.fetchedAt}>
            {new Date(lastFetched).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <button
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={loading}
          title="Vernieuwen"
        >
          {loading ? <Spinner /> : '↺'}
        </button>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

// ── News section ─────────────────────────────────────────────────────────────

function NewsSection({ onSave }) {
  const [query, setQuery] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cache_news'))?.params?.query || 'Bali vastgoed villa investment'; }
    catch { return 'Bali vastgoed villa investment'; }
  });
  const [numResults, setNumResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cache_news'))?.params?.numResults ?? 5; }
    catch { return 5; }
  });
  const [days, setDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cache_news'))?.params?.days ?? 30; }
    catch { return 30; }
  });
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cache_news'))?.result || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.news({ query, numResults, days });
      setData(result);
      localStorage.setItem('cache_news', JSON.stringify({ params: { query, numResults, days }, result }));
    }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [query, numResults, days]);

  useEffect(() => { if (!data) fetch_(); }, [fetch_]);

  return (
    <Section
      title="Nieuws & Artikelen"
      icon="◈"
      onRefresh={fetch_}
      loading={loading}
      lastFetched={data?.fetched_at}
    >
      <div className={styles.searchForm}>
        <div className={styles.searchRow}>
          <label className={styles.label}>Zoektermen</label>
          <input
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Bali vastgoed villa investment"
          />
        </div>
        <div className={styles.searchFilters}>
          <div className={styles.filterItem}>
            <label className={styles.label}>Periode</label>
            <select className={styles.select} value={days} onChange={e => setDays(Number(e.target.value))}>
              <option value={7}>Laatste 7 dagen</option>
              <option value={30}>Laatste 30 dagen</option>
              <option value={60}>Laatste 60 dagen</option>
              <option value={90}>Laatste 90 dagen</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label className={styles.label}>Aantal artikelen</label>
            <select className={styles.select} value={numResults} onChange={e => setNumResults(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
        <button className={styles.searchBtn} onClick={fetch_} disabled={loading}>
          {loading ? <><Spinner /> Zoeken…</> : '◎ Zoeken'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {!data && !loading && !error && (
        <p className={styles.empty}>Klik op Zoeken om artikelen op te halen.</p>
      )}
      {loading && !data && (
        <div className={styles.loadingRow}>
          <Spinner /> <span>Artikelen ophalen via web search…</span>
        </div>
      )}
      {data?.data?.map((item, i) => (
        <article key={i} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.cardSource}>{item.source}</span>
            <Badge color={item.relevance_score > 80 ? 'green' : 'gold'}>
              {item.relevance_score}% relevant
            </Badge>
            {item.date && <span className={styles.cardDate}>{item.date}</span>}
          </div>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.cardSummary}>{item.summary}</p>
          {item.key_insight && (
            <div className={styles.insight}>
              <span className={styles.insightLabel}>💡 Content haak</span>
              <span>{item.key_insight}</span>
            </div>
          )}
          <div className={styles.cardActions}>
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                Artikel lezen →
              </a>
            )}
            <button
              className={styles.saveBtn}
              onClick={() => onSave({
                title: item.title,
                content: item.summary,
                source: item.source,
                source_url: item.url,
                tags: ['nieuws', 'bali'],
              })}
            >
              + Opslaan als idee
            </button>
          </div>
        </article>
      ))}
    </Section>
  );
}

// ── Instagram section ─────────────────────────────────────────────────────────

const PRESET_HASHTAGS = [
  'balirealestate', 'balivillasinvestment', 'baliinvestment', 'baliproperties',
  'balivillasforsale', 'baliproperty', 'balivilla', 'baliinvestor',
  'vastgoedbali', 'baliinvestments', 'expatbali', 'baliliving',
  'luxuryvillasbali', 'balirentals', 'investereninbali',
];

function InstagramSection({ onSave }) {
  const cached = (() => { try { return JSON.parse(localStorage.getItem('cache_instagram')); } catch { return null; } })();

  const [mode, setMode] = useState(() => cached?.params?.mode || 'hashtag');
  const [selectedHashtags, setSelectedHashtags] = useState(
    () => cached?.params?.selectedHashtags || ['balirealestate', 'balivillasinvestment']
  );
  const [customHashtags, setCustomHashtags] = useState(
    () => cached?.params?.customHashtags || ''
  );
  const [usernames, setUsernames] = useState(() => cached?.params?.usernames || '');
  const [keyword, setKeyword] = useState(() => cached?.params?.keyword || '');
  const [days, setDays] = useState(() => cached?.params?.days ?? 30);
  const [minLikes, setMinLikes] = useState(() => cached?.params?.minLikes || 0);
  const [minEngagement, setMinEngagement] = useState(() => cached?.params?.minEngagement || 0);
  const [maxResults, setMaxResults] = useState(() => cached?.params?.maxResults || 25);
  const [data, setData] = useState(() => cached?.result || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleHashtag = (tag) => {
    setSelectedHashtags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const allHashtags = [
    ...selectedHashtags,
    ...customHashtags.split(',').map(h => h.trim().replace('#', '')).filter(Boolean),
  ].join(',');

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.instagram({ mode, hashtags: allHashtags, usernames, days, minLikes, minEngagement, maxResults, keyword });
      setData(result);
      localStorage.setItem('cache_instagram', JSON.stringify({
        params: { mode, selectedHashtags, customHashtags, usernames, keyword, days, minLikes, minEngagement, maxResults },
        result,
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [mode, allHashtags, usernames, keyword, days, minLikes, minEngagement, maxResults]);

  const periodLabel = { 7: 'laatste 7 dagen', 30: 'laatste 30 dagen', 90: 'laatste 90 dagen', 0: 'alle tijd' };

  return (
    <Section
      title="Instagram Inspiratie"
      icon="◉"
      onRefresh={fetch_}
      loading={loading}
      lastFetched={data?.fetched_at}
    >
      <div className={styles.searchForm}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.toggleBtn} ${mode === 'hashtag' ? styles.toggleActive : ''}`}
            onClick={() => setMode('hashtag')}
          >◈ Hashtag</button>
          <button
            className={`${styles.toggleBtn} ${mode === 'creator' ? styles.toggleActive : ''}`}
            onClick={() => setMode('creator')}
          >◉ Creator</button>
        </div>

        {mode === 'hashtag' && <>
          <div className={styles.searchRow}>
            <label className={styles.label}>Hashtags</label>
            <div className={styles.hashtagChips}>
              {PRESET_HASHTAGS.map(tag => (
                <button
                  key={tag}
                  className={`${styles.hashtagChip} ${selectedHashtags.includes(tag) ? styles.hashtagChipActive : ''}`}
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.searchRow}>
            <label className={styles.label}>Extra hashtags (eigen, komma-gescheiden)</label>
            <input
              className={styles.searchInput}
              value={customHashtags}
              onChange={e => setCustomHashtags(e.target.value)}
              placeholder="#eigenhashtag, #nogeen"
            />
          </div>
        </>}

        {mode === 'creator' && (
          <div className={styles.searchRow}>
            <label className={styles.label}>Gebruikersnamen (komma-gescheiden, zonder @)</label>
            <input
              className={styles.searchInput}
              value={usernames}
              onChange={e => setUsernames(e.target.value)}
              placeholder="balirealestate.id, beyond.borders.bali"
            />
          </div>
        )}

        <div className={styles.searchRow}>
          <label className={styles.label}>Keyword (filtert op caption)</label>
          <input
            className={styles.searchInput}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="bijv. villa, investment, ROI"
          />
        </div>
        <div className={styles.searchFilters}>
          <div className={styles.filterItem}>
            <label className={styles.label}>Periode</label>
            <select className={styles.select} value={days} onChange={e => setDays(Number(e.target.value))}>
              <option value={7}>Laatste 7 dagen</option>
              <option value={30}>Laatste 30 dagen</option>
              <option value={90}>Laatste 90 dagen</option>
              <option value={0}>Alles</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label className={styles.label}>Max resultaten</label>
            <select className={styles.select} value={maxResults} onChange={e => setMaxResults(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label className={styles.label}>Min. likes</label>
            <input
              className={styles.filterInput}
              type="number"
              min={0}
              value={minLikes}
              onChange={e => setMinLikes(Number(e.target.value))}
            />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.label}>Min. engagement</label>
            <input
              className={styles.filterInput}
              type="number"
              min={0}
              value={minEngagement}
              onChange={e => setMinEngagement(Number(e.target.value))}
            />
          </div>
        </div>
        <button className={styles.searchBtn} onClick={fetch_} disabled={loading}>
          {loading ? <><Spinner /> Zoeken…</> : '◎ Zoeken'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!data && !loading && !error && (
        <p className={styles.empty}>Selecteer hashtags of vul een onderwerp in, en klik op Zoeken.</p>
      )}
      {loading && (
        <div className={styles.loadingRow}>
          <Spinner /> <span>Apify scraper draaien… (~30–60 sec per hashtag)</span>
        </div>
      )}
      {data && !loading && (
        <p className={styles.resultsMeta}>
          {data.data?.length} posts gevonden · {periodLabel[days]}
        </p>
      )}
      <div className={styles.igGrid}>
      {data?.data?.map((post, i) => (
        <div key={i} className={styles.igCard}>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={`Post van @${post.owner}`}
              className={styles.igImage}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <div className={styles.igBody}>
            <div className={styles.igMeta}>
              <span className={styles.igOwner}>@{post.owner}</span>
              {post.source_label && <span className={styles.igHashtag}>{post.source_label}</span>}
              {post.timestamp && (
                <span className={styles.igDate}>
                  {new Date(post.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            <div className={styles.igMeta}>
              <Badge color="coral">❤ {post.likes?.toLocaleString('nl-NL')}</Badge>
              <Badge color="dim">💬 {post.comments?.toLocaleString('nl-NL')}</Badge>
              <Badge color={post.engagement_score > 1000 ? 'green' : 'gold'}>
                score {post.engagement_score}
              </Badge>
            </div>
            {post.caption && <p className={styles.igCaption}>{post.caption}…</p>}
            <div className={styles.cardActions}>
              {post.url && (
                <a href={post.url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                  Bekijk post →
                </a>
              )}
              <button
                className={styles.saveBtn}
                onClick={() => onSave({
                  title: `Post van @${post.owner}`,
                  content: post.caption,
                  source: 'instagram',
                  source_url: post.url,
                  tags: ['instagram', 'repost-inspiratie'],
                })}
              >
                + Opslaan als idee
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
      {data?.data?.length === 0 && !loading && (
        <p className={styles.empty}>Geen posts gevonden voor deze filters. Probeer een langere periode of lagere drempelwaarden.</p>
      )}
    </Section>
  );
}

// ── Content generator modal ───────────────────────────────────────────────────

const CONTENT_TYPES = {
  instagram: [
    { id: 'instagram_carousel', label: 'Carrousel (educatief)' },
    { id: 'instagram_reel',     label: 'Reel Script (30 sec)' },
    { id: 'instagram_story',    label: 'Story Reeks' },
  ],
  linkedin: [
    { id: 'linkedin_verhaal',   label: 'Verhaalpost' },
    { id: 'linkedin_contrair',  label: 'Contraire Post' },
    { id: 'linkedin_lijst',     label: 'Lijstpost' },
    { id: 'linkedin_howto',     label: 'Hoe-doe-je-het' },
  ],
};

function ContentResult({ result, contentType }) {
  if (!result) return null;

  // Carrousel
  if (contentType === 'instagram_carousel') return (
    <div className={styles.captionResult}>
      <div className={styles.contentSection}>
        <span className={styles.label}>Slides</span>
        {result.slides?.map((s, i) => (
          <div key={i} className={styles.slideRow}>
            <span className={styles.slideNum}>Slide {s.nummer}</span>
            <p className={styles.slideText}>{s.tekst}</p>
            <CopyButton text={s.tekst} />
          </div>
        ))}
      </div>
      <div className={styles.contentSection}>
        <div className={styles.captionHeader}>
          <span className={styles.label}>Caption</span>
          <CopyButton text={result.caption} />
        </div>
        <p className={styles.captionText}>{result.caption}</p>
        <div className={styles.captionHashtags}>
          {result.hashtags?.map((h, i) => <span key={i} className={styles.hashtagPill}>{h}</span>)}
        </div>
      </div>
    </div>
  );

  // Reel
  if (contentType === 'instagram_reel') return (
    <div className={styles.captionResult}>
      {[['Hook (0-2 sec)', result.hook], ['Context (2-5 sec)', result.context],
        ['Waarde (5-25 sec)', result.waarde], ['CTA (25-30 sec)', result.cta]].map(([label, text]) => (
        <div key={label} className={styles.contentSection}>
          <div className={styles.captionHeader}>
            <span className={styles.label}>{label}</span>
            <CopyButton text={text} />
          </div>
          <p className={styles.captionText}>{text}</p>
        </div>
      ))}
      <div className={styles.contentSection}>
        <div className={styles.captionHeader}>
          <span className={styles.label}>Caption</span>
          <CopyButton text={result.caption} />
        </div>
        <p className={styles.captionText}>{result.caption}</p>
        <div className={styles.captionHashtags}>
          {result.hashtags?.map((h, i) => <span key={i} className={styles.hashtagPill}>{h}</span>)}
        </div>
      </div>
    </div>
  );

  // Story reeks
  if (contentType === 'instagram_story') return (
    <div className={styles.captionResult}>
      {result.stories?.map((s, i) => (
        <div key={i} className={styles.contentSection}>
          <div className={styles.captionHeader}>
            <span className={styles.label}>Story {s.nummer}</span>
            <CopyButton text={s.tekst} />
          </div>
          <p className={styles.captionText}>{s.tekst}</p>
          {s.poll_opties && (
            <div className={styles.pollOpties}>
              {s.poll_opties.map((o, j) => <span key={j} className={styles.hashtagPill}>{o}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // LinkedIn posts (verhaal, contrair, lijst, howto)
  return (
    <div className={styles.captionResult}>
      {result.eerste_regel && (
        <div className={styles.contentSection}>
          <div className={styles.captionHeader}>
            <span className={styles.label}>Eerste regel (zichtbaar voor "zie meer")</span>
            <CopyButton text={result.eerste_regel} />
          </div>
          <p className={styles.captionText} style={{ color: 'var(--gold)' }}>{result.eerste_regel}</p>
        </div>
      )}
      <div className={styles.contentSection}>
        <div className={styles.captionHeader}>
          <span className={styles.label}>Volledige post</span>
          <CopyButton text={result.post} />
        </div>
        <p className={styles.captionText}>{result.post}</p>
      </div>
    </div>
  );
}

function ContentGenerator({ idea, onClose, onSavePost, generation, onGenerate }) {
  const [platform, setPlatform] = useState(generation?.platform || 'instagram');
  const [contentType, setContentType] = useState(generation?.contentType || 'instagram_carousel');
  const [extraContext, setExtraContext] = useState('');
  const [saved, setSaved] = useState(false);

  const loading = generation?.loading ?? false;
  const result = generation?.result ?? null;
  const error = generation?.error ?? null;

  const switchPlatform = (p) => {
    setPlatform(p);
    setContentType(CONTENT_TYPES[p][0].id);
  };

  const handleSavePost = () => {
    onSavePost({ title: idea.title, platform, contentType, data: result });
    setSaved(true);
  };

  const handleGenerate = () => {
    onGenerate(idea, platform, contentType, extraContext);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Content maken</h2>
        <p className={styles.modalTopic}>{idea.title}</p>

        <div className={styles.modalRow}>
          <label className={styles.label}>Platform</label>
          <div className={styles.toggleGroup}>
            <button className={`${styles.toggleBtn} ${platform === 'instagram' ? styles.toggleActive : ''}`}
              onClick={() => switchPlatform('instagram')}>Instagram</button>
            <button className={`${styles.toggleBtn} ${platform === 'linkedin' ? styles.toggleActive : ''}`}
              onClick={() => switchPlatform('linkedin')}>LinkedIn</button>
          </div>
        </div>

        <div className={styles.modalRow}>
          <label className={styles.label}>Type content</label>
          <div className={styles.toggleGroup} style={{ flexWrap: 'wrap' }}>
            {CONTENT_TYPES[platform].map(t => (
              <button key={t.id}
                className={`${styles.toggleBtn} ${contentType === t.id ? styles.toggleActive : ''}`}
                onClick={() => { setContentType(t.id); setResult(null); }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.modalRow}>
          <label className={styles.label}>Extra context (optioneel — klantuitspraak, anekdote, situatie)</label>
          <textarea
            className={styles.searchInput}
            rows={3}
            value={extraContext}
            onChange={e => setExtraContext(e.target.value)}
            placeholder="Bijv: Een klant zei vorige week: 'Ik wist niet waar ik moest beginnen...'"
            style={{ resize: 'vertical' }}
          />
        </div>

        <button className={styles.generateBtn} onClick={handleGenerate} disabled={loading}>
          {loading ? <><Spinner /> Genereren…</> : '✦ Genereer content'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {result && (
          <button
            className={styles.saveBtn}
            style={{ alignSelf: 'flex-start' }}
            onClick={handleSavePost}
            disabled={saved}
          >
            {saved ? '✓ Opgeslagen in Posts' : '+ Opslaan als post'}
          </button>
        )}
        <ContentResult result={result} contentType={contentType} />
      </div>
    </div>
  );
}

// ── Posts board ───────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  instagram_carousel: 'Carrousel',
  instagram_reel:     'Reel',
  instagram_story:    'Story Reeks',
  linkedin_verhaal:   'Verhaalpost',
  linkedin_contrair:  'Contraire Post',
  linkedin_lijst:     'Lijstpost',
  linkedin_howto:     'Hoe-doe-je-het',
};

const STATUS_COLORS = { concept: 'gold', klaar: 'blue', geplaatst: 'green' };

function extractMainText(data, contentType) {
  if (!data) return '';
  if (contentType === 'instagram_carousel') return data.slides?.map(s => `Slide ${s.nummer}: ${s.tekst}`).join('\n\n') + (data.caption ? `\n\nCaption:\n${data.caption}` : '');
  if (contentType === 'instagram_reel') return `Hook: ${data.hook}\n\nContext: ${data.context}\n\nWaarde: ${data.waarde}\n\nCTA: ${data.cta}` + (data.caption ? `\n\nCaption:\n${data.caption}` : '');
  if (contentType === 'instagram_story') return data.stories?.map(s => `Story ${s.nummer}: ${s.tekst}${s.poll_opties ? '\nPoll: ' + s.poll_opties.join(' / ') : ''}`).join('\n\n') || '';
  return data.post || '';
}

function PostEditor({ post, onSave, onClose }) {
  const [text, setText] = useState(() => post.editedText ?? extractMainText(post.data, post.contentType));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Post bewerken</h2>
        <p className={styles.modalTopic}>{post.title}</p>
        <div className={styles.postMeta}>
          <Badge color={post.platform === 'instagram' ? 'coral' : 'blue'}>{post.platform}</Badge>
          <Badge color="dim">{TYPE_LABELS[post.contentType]}</Badge>
        </div>
        <textarea
          className={styles.postTextarea}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={16}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={styles.generateBtn} onClick={() => { onSave(text); onClose(); }}>
            Opslaan
          </button>
          <button className={styles.saveBtn} onClick={onClose}>Annuleren</button>
        </div>
      </div>
    </div>
  );
}

function PostsBoard({ posts, update, remove }) {
  const [editPost, setEditPost] = useState(null);

  const copyText = (post) => {
    const text = post.editedText ?? extractMainText(post.data, post.contentType);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Section title={`Posts (${posts.length})`} icon="✦" onRefresh={() => {}} loading={false}>
        {posts.length === 0 && (
          <p className={styles.empty}>Nog geen posts opgeslagen. Genereer content via het Ideeënboard.</p>
        )}
        {posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postCardTop}>
              <div className={styles.postMeta}>
                <Badge color={post.platform === 'instagram' ? 'coral' : 'blue'}>{post.platform}</Badge>
                <Badge color="dim">{TYPE_LABELS[post.contentType]}</Badge>
                <Badge color={STATUS_COLORS[post.status] || 'gold'}>{post.status}</Badge>
              </div>
              <span className={styles.ideaDate}>{new Date(post.savedAt).toLocaleDateString('nl-NL')}</span>
            </div>
            <p className={styles.ideaTitle}>{post.title}</p>
            <p className={styles.postPreview}>
              {(post.editedText ?? extractMainText(post.data, post.contentType)).slice(0, 140)}…
            </p>
            <div className={styles.ideaActions}>
              <button className={styles.generateBtn} style={{ padding: '6px 14px', fontSize: 14 }}
                onClick={() => setEditPost(post)}>
                ✎ Bewerken
              </button>
              <button className={styles.saveBtn} onClick={() => copyText(post)}>
                ⎘ Kopiëren
              </button>
              <div className={styles.statusBtns}>
                {['concept', 'klaar', 'geplaatst'].map(s => (
                  <button key={s}
                    className={`${styles.statusBtn} ${post.status === s ? styles.statusActive : ''}`}
                    onClick={() => update(post.id, { status: s })}>{s}</button>
                ))}
              </div>
              <button className={styles.removeBtn} onClick={() => remove(post.id)}>✕</button>
            </div>
          </div>
        ))}
      </Section>
      {editPost && (
        <PostEditor
          post={editPost}
          onSave={(text) => update(editPost.id, { editedText: text })}
          onClose={() => setEditPost(null)}
        />
      )}
    </>
  );
}

// ── Ideas board ───────────────────────────────────────────────────────────────

function IdeasBoard({ ideas, onUpdateStatus, onRemove, onSavePost, generations, onGenerate }) {
  const [captionIdea, setCaptionIdea] = useState(null);

  const statusColors = { saved: 'gold', draft: 'blue', used: 'green' };

  return (
    <>
      <Section
        title={`Ideeënboard (${ideas.length})`}
        icon="◇"
        onRefresh={() => {}}
        loading={false}
      >
        {ideas.length === 0 && (
          <p className={styles.empty}>Nog geen ideeën opgeslagen. Sla items op via de secties hierboven.</p>
        )}
        {ideas.map(idea => (
          <div key={idea.id} className={styles.ideaCard}>
            <div className={styles.ideaTop}>
              <span className={styles.ideaSource}>{idea.source}</span>
              <Badge color={statusColors[idea.status] || 'gold'}>{idea.status}</Badge>
              <span className={styles.ideaDate}>
                {new Date(idea.savedAt).toLocaleDateString('nl-NL')}
              </span>
            </div>
            <p className={styles.ideaTitle}>{idea.title}</p>
            {idea.content && <p className={styles.ideaContent}>{idea.content.slice(0, 120)}…</p>}
            {idea.tags?.length > 0 && (
              <div className={styles.tagRow}>
                {idea.tags.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
              </div>
            )}
            <div className={styles.ideaActions}>
              <button className={styles.generateBtn} style={{ padding: '6px 14px', fontSize: 14 }}
                onClick={() => setCaptionIdea(idea)}>
                {generations[idea.id]?.loading ? <><Spinner /> Genereren…</> :
                 generations[idea.id]?.result ? '✦ Content klaar' :
                 '✦ Maak content'}
              </button>
              <div className={styles.statusBtns}>
                {['saved', 'draft', 'used'].map(s => (
                  <button
                    key={s}
                    className={`${styles.statusBtn} ${idea.status === s ? styles.statusActive : ''}`}
                    onClick={() => onUpdateStatus(idea.id, s)}
                  >{s}</button>
                ))}
              </div>
              <button className={styles.removeBtn} onClick={() => onRemove(idea.id)}>✕</button>
            </div>
          </div>
        ))}
      </Section>

      {captionIdea && (
        <ContentGenerator
          idea={captionIdea}
          onClose={() => setCaptionIdea(null)}
          onSavePost={onSavePost}
          generation={generations[captionIdea.id] || null}
          onGenerate={onGenerate}
        />
      )}
    </>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'news',      label: 'Nieuws & Artikelen',   icon: '◈' },
  { id: 'instagram', label: 'Instagram Inspiratie',  icon: '◉' },
  { id: 'ideas',     label: 'Ideeënboard',           icon: '◇' },
  { id: 'posts',     label: 'Posts',                 icon: '✦' },
];

export default function App() {
  const { ideas, save, updateStatus, remove } = useIdeas();
  const { posts, save: savePost, update: updatePost, remove: removePost } = usePosts();
  const [activeTab, setActiveTab] = useState('news');
  const [toast, setToast] = useState(null);
  const [generations, setGenerations] = useState({});
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const startGeneration = useCallback(async (idea, platform, contentType, extraContext) => {
    const id = idea.id;
    setGenerations(prev => ({ ...prev, [id]: { loading: true, result: null, error: null, platform, contentType } }));
    const parts = [idea.title];
    if (idea.content && idea.content !== idea.title) parts.push(idea.content);
    if (idea.source) parts.push(`Bron: ${idea.source}`);
    const topic = parts.join('\n\n');
    try {
      const res = await api.generateContent(topic, platform, contentType, extraContext);
      setGenerations(prev => ({ ...prev, [id]: { ...prev[id], loading: false, result: res.data } }));
      showToast(`Content klaar: "${idea.title.slice(0, 35)}"`);
    } catch (e) {
      setGenerations(prev => ({ ...prev, [id]: { ...prev[id], loading: false, error: e.message } }));
      showToast(`Genereren mislukt`);
    }
  }, [showToast]);

  const handleSave = (idea) => {
    save(idea);
    setActiveTab('ideas');
    showToast(`"${idea.title.slice(0, 40)}" opgeslagen als idee`);
  };

  const handleSavePost = (post) => {
    savePost(post);
    setActiveTab('posts');
    showToast(`Post opgeslagen`);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoBB}>BEYOND BORDERS</span>
            <span className={styles.logoSub}>CONTENT MACHINE</span>
          </div>
        </div>
      </header>

      <nav className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'ideas' && ideas.length > 0 && (
                <span className={styles.tabBadge}>{ideas.length}</span>
              )}
              {tab.id === 'posts' && posts.length > 0 && (
                <span className={styles.tabBadge}>{posts.length}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
        {activeTab === 'news'      && <NewsSection onSave={handleSave} />}
        {activeTab === 'instagram' && <InstagramSection onSave={handleSave} />}
        {activeTab === 'ideas'     && <IdeasBoard ideas={ideas} onUpdateStatus={updateStatus} onRemove={remove} onSavePost={handleSavePost} generations={generations} onGenerate={startGeneration} />}
        {activeTab === 'posts'     && <PostsBoard posts={posts} update={updatePost} remove={removePost} />}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
