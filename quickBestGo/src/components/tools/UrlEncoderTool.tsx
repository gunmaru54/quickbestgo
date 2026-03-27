'use client';

import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface UrlEncoderToolProps {
  dict: {
    label_input: string;
    label_output: string;
    btn_encode: string;
    btn_decode: string;
    btn_copy: string;
    btn_clear: string;
    placeholder_encode: string;
    placeholder_decode: string;
    copied: string;
    error_decode: string;
  };
  theme: CategoryTheme;
}

export default function UrlEncoderTool({ dict, theme }: UrlEncoderToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleEncode = () => {
    setError('');
    setMode('encode');
    try {
      setOutput(encodeURIComponent(input));
    } catch {
      setOutput('');
      setError(dict.error_decode);
    }
  };

  const handleDecode = () => {
    setError('');
    setMode('decode');
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput('');
      setError(dict.error_decode);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className={`max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="url-encoder-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_input}
          </label>
          <textarea
            id="url-encoder-input"
            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all font-mono text-sm resize-none`}
            rows={6}
            maxLength={500000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? dict.placeholder_encode : dict.placeholder_decode}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEncode}
            className={`py-3 px-6 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all`}
          >
            {dict.btn_encode}
          </button>
          <button
            onClick={handleDecode}
            className="py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            {dict.btn_decode}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_output}
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                title={dict.btn_copy}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-40"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleClear}
                title={dict.btn_clear}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <textarea
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all font-mono text-sm resize-none`}
            rows={6}
            value={output}
            readOnly
            placeholder=""
          />
          {copied && (
            <p className="mt-1 text-sm text-green-500 dark:text-green-400">{dict.copied}</p>
          )}
        </div>
      </div>
    </div>
  );
}
