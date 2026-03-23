'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
  dict: {
    label_name: string;
    label_email: string;
    label_message: string;
    placeholder_name: string;
    placeholder_email: string;
    placeholder_message: string;
    btn_submit: string;
    btn_sending: string;
    success_title: string;
    success_message: string;
    error_message: string;
  };
}

const FORMSPREE_URL = 'https://formspree.io/f/xkoqlzaw';

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
        <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-1">{dict.success_title}</h3>
        <p className="text-green-600 dark:text-green-400 text-sm">{dict.success_message}</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cf-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {dict.label_name}
        </label>
        <input
          id="cf-name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.placeholder_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {dict.label_email}
        </label>
        <input
          id="cf-email"
          type="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.placeholder_email}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {dict.label_message}
        </label>
        <textarea
          id="cf-message"
          required
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.placeholder_message}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="shrink-0" />
          {dict.error_message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {dict.btn_sending}
          </>
        ) : (
          <>
            <Send size={18} />
            {dict.btn_submit}
          </>
        )}
      </button>
    </form>
  );
}
