'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const FAVORITES_KEY = 'qbg_favorites';

function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  } catch { /* ignore */ }
}

interface FavoriteButtonProps {
  slug: string;
  labelAdd: string;
  labelRemove: string;
}

export default function FavoriteButton({ slug, labelAdd, labelRemove }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsFav(loadFavorites().has(slug));
    setMounted(true);
  }, [slug]);

  if (!mounted) return null;

  const toggle = () => {
    setIsFav(prev => {
      const favs = loadFavorites();
      if (prev) {
        favs.delete(slug);
      } else {
        favs.add(slug);
      }
      saveFavorites(favs);
      return !prev;
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? labelRemove : labelAdd}
      aria-pressed={isFav}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-150 hover:scale-105 ${
        isFav
          ? 'bg-[#E60076] text-white border-[#E60076]'
          : 'bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 text-white/80 hover:border-white/60 hover:text-white'
      }`}
    >
      <Heart size={14} className={isFav ? 'fill-current' : ''} aria-hidden="true" />
      {isFav ? labelRemove : labelAdd}
    </button>
  );
}
