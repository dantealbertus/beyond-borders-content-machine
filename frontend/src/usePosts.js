import { useState, useEffect } from 'react';

const KEY = 'bb_posts';

export function usePosts() {
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(posts));
  }, [posts]);

  const save = (post) => {
    const entry = {
      id: Date.now(),
      ...post,
      status: 'concept',
      savedAt: new Date().toISOString(),
    };
    setPosts(prev => [entry, ...prev]);
    return entry;
  };

  const update = (id, changes) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  };

  const remove = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return { posts, save, update, remove };
}
