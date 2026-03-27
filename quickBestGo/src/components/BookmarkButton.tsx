'use client';

import { useState, useEffect, useRef } from 'react';
import { Bookmark, Copy, Check } from 'lucide-react';

type Lang = 'ko' | 'en' | 'es' | 'ja' | 'pt';

const T: Record<Lang, {
  label: string;
  tipTitle: string;
  tipDesc: string;
  copy: string;
  copied: string;
}> = {
  ko: {
    label: '북마크',
    tipTitle: '브라우저 북마크에 추가',
    tipDesc: 'Windows · Linux: Ctrl + D\nMac: ⌘ + D',
    copy: 'URL 복사',
    copied: '복사됨!',
  },
  en: {
    label: 'Bookmark',
    tipTitle: 'Add to Browser Bookmarks',
    tipDesc: 'Windows · Linux: Ctrl + D\nMac: ⌘ + D',
    copy: 'Copy URL',
    copied: 'Copied!',
  },
  es: {
    label: 'Marcador',
    tipTitle: 'Añadir a marcadores',
    tipDesc: 'Windows · Linux: Ctrl + D\nMac: ⌘ + D',
    copy: 'Copiar URL',
    copied: '¡Copiado!',
  },
  ja: {
    label: 'ブックマーク',
    tipTitle: 'ブラウザにブックマーク追加',
    tipDesc: 'Windows · Linux: Ctrl + D\nMac: ⌘ + D',
    copy: 'URLをコピー',
    copied: 'コピー済み!',
  },
  pt: {
    label: 'Favorito',
    tipTitle: 'Adicionar aos favoritos',
    tipDesc: 'Windows · Linux: Ctrl + D\nMac: ⌘ + D',
    copy: 'Copiar URL',
    copied: 'Copiado!',
  },
};

export default function BookmarkButton({ lang }: { lang: string }) {
  const t = T[(lang as Lang)] ?? T.en;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close popover on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = () => {
    /* Mobile: use native share sheet if available */
    if (typeof navigator.share === 'function') {
      navigator.share({ url: window.location.href, title: document.title }).catch(() => {});
      return;
    }
    setOpen(prev => !prev);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 2000);
    }).catch(() => {});
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={handleClick}
        aria-label={t.label}
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-150 hover:scale-105 ${
          open
            ? 'bg-white/20 border-white/60 text-white'
            : 'bg-white/10 dark:bg-white/5 border-white/30 dark:border-white/20 text-white/80 hover:border-white/60 hover:text-white'
        }`}
      >
        <Bookmark size={14} aria-hidden="true" />
        {t.label}
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-56 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 text-left"
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[#1e1e1e] border-l border-t border-gray-200 dark:border-gray-700" aria-hidden="true" />

          <p className="text-sm font-bold text-brand-text dark:text-white mb-2">{t.tipTitle}</p>
          <div className="flex flex-col gap-1 mb-3">
            {t.tipDesc.split('\n').map((line, i) => (
              <code key={i} className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                {line}
              </code>
            ))}
          </div>

          <button
            onClick={copyUrl}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-bold hover:bg-brand-primary/20 transition-colors duration-150"
          >
            {copied
              ? <Check size={14} aria-hidden="true" />
              : <Copy size={14} aria-hidden="true" />}
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}
    </div>
  );
}
