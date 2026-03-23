'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface JsonFormatterToolProps {
  dict: {
    label_input: string;
    label_output: string;
    btn_format: string;
    btn_minify: string;
    btn_copy: string;
    btn_clear: string;
    placeholder: string;
    copied: string;
    error_invalid: string;
    status_valid: string;
    label_indent: string;
  };
  theme: CategoryTheme;
}

type Status = 'idle' | 'valid' | 'error';

export default function JsonFormatterTool({ dict, theme }: JsonFormatterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus('valid');
    } catch (e) {
      setOutput('');
      setStatus('error');
      setError(e instanceof Error ? e.message : dict.error_invalid);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus('valid');
    } catch (e) {
      setOutput('');
      setStatus('error');
      setError(e instanceof Error ? e.message : dict.error_invalid);
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
    setStatus('idle');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-4">
        <div>
          <label htmlFor="json-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_input}
          </label>
          <textarea
            id="json-input"
            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all font-mono text-sm resize-none`}
            rows={8}
            maxLength={500000}
            value={input}
            onChange={(e) => { setInput(e.target.value); setStatus('idle'); setError(''); }}
            placeholder={dict.placeholder}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleFormat}
            className={`py-3 px-6 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all`}
          >
            {dict.btn_format}
          </button>
          <button
            onClick={handleMinify}
            className="py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            {dict.btn_minify}
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-40"
          >
            {copied ? dict.copied : dict.btn_copy}
          </button>
          <button
            onClick={handleClear}
            className="py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            {dict.btn_clear}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="json-indent" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {dict.label_indent}:
            </label>
            <select
              id="json-indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className={`px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:ring-2 ${theme.ring} focus:outline-none`}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>

        {status !== 'idle' && (
          <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg ${
            status === 'valid'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            <span>{status === 'valid' ? `✓ ${dict.status_valid}` : `✗ ${dict.error_invalid}`}</span>
            {status === 'error' && error && (
              <span className="font-normal text-xs ml-1 opacity-80">— {error}</span>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_output}
          </label>
          <div className="relative">
            <textarea
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all font-mono text-sm resize-none`}
              rows={8}
              value={output}
              readOnly
              placeholder=""
            />
            {output && (
              <button
                onClick={handleCopy}
                title={dict.btn_copy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
