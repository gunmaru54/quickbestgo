'use client';

import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface WordCounterProps {
  dict: {
    label_input: string;
    placeholder: string;
    btn_clear: string;
    stat_words: string;
    stat_chars: string;
    stat_chars_no_space: string;
    stat_sentences: string;
    stat_paragraphs: string;
    stat_reading_time: string;
    stat_reading_unit: string;
    keyword_title: string;
  };
  lang: string;
  theme: CategoryTheme;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'is', 'it', 'be', 'as', 'was', 'are', 'were', 'been', 'has',
  'have', 'had', 'do', 'did', 'does', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'that', 'this', 'with', 'from', 'by', 'not',
  'but', 'also',
]);

interface Stats {
  words: number;
  chars: number;
  charsNoSpace: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  keywords: Array<{ word: string; count: number }>;
}

function analyzeText(text: string): Stats {
  if (!text.trim()) {
    return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readingTime: 0, keywords: [] };
  }

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;

  const wordMatches = text.match(/\b[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]+\b/g);
  const words = wordMatches ? wordMatches.length : 0;

  const sentenceMatches = text.match(/[^.!?]*[.!?]+/g);
  const sentences = sentenceMatches ? sentenceMatches.length : (text.trim() ? 1 : 0);

  const paragraphBlocks = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphs = paragraphBlocks.length;

  const readingTime = Math.ceil(words / 200);

  // Keyword density: top 5 non-stop-words
  const freqMap: Record<string, number> = {};
  if (wordMatches) {
    for (const w of wordMatches) {
      const lower = w.toLowerCase();
      if (!STOP_WORDS.has(lower) && lower.length > 2) {
        freqMap[lower] = (freqMap[lower] ?? 0) + 1;
      }
    }
  }
  const keywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, keywords };
}

const WordCounter = ({ dict, theme }: WordCounterProps) => {
  const [text, setText] = useState('');

  const stats = analyzeText(text);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const statCards = [
    { label: dict.stat_words, value: stats.words },
    { label: dict.stat_chars, value: stats.chars },
    { label: dict.stat_chars_no_space, value: stats.charsNoSpace },
    { label: dict.stat_sentences, value: stats.sentences },
    { label: dict.stat_paragraphs, value: stats.paragraphs },
    { label: dict.stat_reading_time, value: `${stats.readingTime} ${dict.stat_reading_unit}` },
  ];

  return (
    <div className={`max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
      <div className="space-y-6">
        {/* Textarea */}
        <div className="space-y-2">
          <label htmlFor="word-counter-input" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {dict.label_input}
          </label>
          <textarea
            id="word-counter-input"
            value={text}
            onChange={handleChange}
            placeholder={dict.placeholder}
            rows={12}
            maxLength={100000}
            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 ${theme.ring} focus:outline-none transition-all resize-y leading-relaxed`}
          />
        </div>

        {/* Clear button */}
        {text && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
          >
            <X size={14} />
            {dict.btn_clear}
          </button>
        )}

        {/* Stats grid 2×3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${theme.accentBg} p-4 rounded-2xl text-center border ${theme.accentBorder}`}
            >
              <span className={`block text-2xl md:text-3xl font-black ${theme.accent}`}>
                {card.value}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1 block">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Keyword density */}
        {stats.keywords.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {dict.keyword_title}
            </h3>
            <div className="space-y-2">
              {stats.keywords.map(({ word, count }, i) => {
                const maxCount = stats.keywords[0].count;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={word} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-gray-400 dark:text-gray-500 text-right">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-24 truncate">{word}</span>
                    <div className={`flex-1 h-2 ${theme.accentBg} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full ${theme.accent.replace('text-', 'bg-')} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${theme.accent} w-6 text-right`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCounter;
