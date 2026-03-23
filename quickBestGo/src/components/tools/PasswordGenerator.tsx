'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface PasswordGeneratorProps {
  dict: {
    label_length: string;
    label_uppercase: string;
    label_numbers: string;
    label_symbols: string;
    btn_generate: string;
    tooltip_copy: string;
  };
  theme: CategoryTheme;
}

const PasswordGenerator = ({ dict, theme }: PasswordGeneratorProps) => {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = useCallback(() => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    const randomValues = crypto.getRandomValues(new Uint32Array(length));
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += chars[randomValues[i] % chars.length];
    }
    setPassword(generatedPassword);
    setCopied(false);
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial generation
  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        <div className="relative group">
          <div className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl text-center font-mono text-xl md:text-2xl break-all min-h-[4rem] flex items-center justify-center pr-12 text-gray-900 dark:text-gray-100">
            {password}
          </div>
          <button
            onClick={copyToClipboard}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors ${theme.accent}`}
            title={dict.tooltip_copy}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span>{dict.label_length}</span>
              <span>{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-current"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: dict.label_uppercase, state: includeUppercase, setState: setIncludeUppercase },
              { label: dict.label_numbers, state: includeNumbers, setState: setIncludeNumbers },
              { label: dict.label_symbols, state: includeSymbols, setState: setIncludeSymbols },
            ].map((option) => (
              <label 
                key={option.label}
                className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                <input
                  type="checkbox"
                  checked={option.state}
                  onChange={(e) => option.setState(e.target.checked)}
                  className={`w-6 h-6 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${theme.accent} ${theme.ring}`}
                />
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generatePassword}
          className={`w-full py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
        >
          <RefreshCw size={20} />
          {dict.btn_generate}
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
