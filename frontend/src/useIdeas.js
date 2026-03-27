import { useState, useEffect } from 'react';

const KEY = 'bb_ideas';

export function useIdeas() {
  const [ideas, setIdeas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ideas));
  }, [ideas]);

  const save = (idea) => {
    const entry = {
      id: Date.now(),
      ...idea,
      status: 'saved',
      savedAt: new Date().toISOString(),
    };
    setIdeas(prev => [entry, ...prev]);
    return entry;
  };

  const updateStatus = (id, status) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const remove = (id) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return { ideas, save, updateStatus, remove };
}
