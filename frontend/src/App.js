import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { useIdeas } from './useIdeas';
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

// ── Caption generator modal ───────────────────────────────────────────────────

function CaptionGenerator({ idea, onClose }) {
  const [style, setStyle] = useState('educatief');
  const [language, setLanguage] = useState('nl');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.generateCaption(idea.content || idea.title, style, language);
      setResult(res.data);
    } catch (e) {
      alert('Caption genereren mislukt: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Caption genereren</h2>
        <p className={styles.modalTopic}>{idea.title}</p>

        <div className={styles.modalRow}>
          <label className={styles.label}>Stijl</label>
          <div className={styles.toggleGroup}>
            {['educatief', 'inspirerend', 'cijfers'].map(s => (
              <button
                key={s}
                className={`${styles.toggleBtn} ${style === s ? styles.toggleActive : ''}`}
                onClick={() => setStyle(s)}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className={styles.modalRow}>
          <label className={styles.label}>Taal</label>
          <div className={styles.toggleGroup}>
            {[['nl', '🇳🇱 Nederlands'], ['en', '🇬🇧 English']].map(([v, l]) => (
              <button
                key={v}
                className={`${styles.toggleBtn} ${language === v ? styles.toggleActive : ''}`}
                onClick={() => setLanguage(v)}
              >{l}</button>
            ))}
          </div>
        </div>

        <button className={styles.generateBtn} onClick={generate} disabled={loading}>
          {loading ? <><Spinner /> Genereren…</> : '✦ Genereer caption'}
        </button>

        {result && (
          <div className={styles.captionResult}>
            <div className={styles.captionHeader}>
              <span className={styles.label}>Caption</span>
              <CopyButton text={result.caption} />
            </div>
            <p className={styles.captionText}>{result.caption}</p>
            {result.hashtags && (
              <div className={styles.captionHashtags}>
                {result.hashtags.map((h, i) => (
                  <span key={i} className={styles.hashtagPill}>{h}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ideas board ───────────────────────────────────────────────────────────────

function IdeasBoard({ ideas, onUpdateStatus, onRemove }) {
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
              <button className={styles.generateBtn} style={{ padding: '6px 14px', fontSize: 12 }}
                onClick={() => setCaptionIdea(idea)}>
                ✦ Caption
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
        <CaptionGenerator idea={captionIdea} onClose={() => setCaptionIdea(null)} />
      )}
    </>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'news',      label: 'Nieuws & Artikelen',   icon: '◈' },
  { id: 'instagram', label: 'Instagram Inspiratie',  icon: '◉' },
  { id: 'ideas',     label: 'Ideeënboard',           icon: '◇' },
];

export default function App() {
  const { ideas, save, updateStatus, remove } = useIdeas();
  const [activeTab, setActiveTab] = useState('news');
  const [toast, setToast] = useState(null);

  const handleSave = (idea) => {
    save(idea);
    setActiveTab('ideas');
    setToast(`"${idea.title.slice(0, 40)}" opgeslagen`);
    setTimeout(() => setToast(null), 2500);
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
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
        {activeTab === 'news'      && <NewsSection onSave={handleSave} />}
        {activeTab === 'instagram' && <InstagramSection onSave={handleSave} />}
        {activeTab === 'ideas'     && <IdeasBoard ideas={ideas} onUpdateStatus={updateStatus} onRemove={remove} />}
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
