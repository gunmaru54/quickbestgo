'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorConverterToolProps {
  dict: {
    label_hex: string;
    label_rgb: string;
    label_hsl: string;
    label_preview: string;
    label_picker: string;
    btn_copy: string;
    copied: string;
  };
}

// Conversion helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseRgb(val: string): { r: number; g: number; b: number } | null {
  const m = val.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return null;
  const [r, g, b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
  return { r, g, b };
}

function parseHsl(val: string): { h: number; s: number; l: number } | null {
  const m = val.match(/(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/);
  if (!m) return null;
  const [h, s, l] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

const DEFAULT_HEX = '#3B82F6';

export default function ColorConverterTool({ dict }: ColorConverterToolProps) {
  const defaultRgb = hexToRgb(DEFAULT_HEX)!;
  const defaultHsl = rgbToHsl(defaultRgb.r, defaultRgb.g, defaultRgb.b);

  const [hex, setHex] = useState(DEFAULT_HEX);
  const [rgb, setRgb] = useState(`rgb(${defaultRgb.r}, ${defaultRgb.g}, ${defaultRgb.b})`);
  const [hsl, setHsl] = useState(`hsl(${defaultHsl.h}, ${defaultHsl.s}%, ${defaultHsl.l}%)`);
  const [preview, setPreview] = useState(DEFAULT_HEX);
  const [hexError, setHexError] = useState('');
  const [rgbError, setRgbError] = useState('');
  const [hslError, setHslError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const syncFromRgb = useCallback((r: number, g: number, b: number) => {
    const newHex = rgbToHex(r, g, b);
    const { h, s, l } = rgbToHsl(r, g, b);
    setHex(newHex);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    setPreview(newHex);
  }, []);

  const handleHexChange = (val: string) => {
    setHex(val);
    setHexError('');
    const normalized = val.startsWith('#') ? val : '#' + val;
    const parsed = hexToRgb(normalized);
    if (parsed) {
      const { r, g, b } = parsed;
      const { h, s, l } = rgbToHsl(r, g, b);
      const fullHex = rgbToHex(r, g, b);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
      setPreview(fullHex);
      setHexError('');
    } else if (val.length >= 4) {
      setHexError('Invalid HEX');
    }
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    setRgbError('');
    const parsed = parseRgb(val);
    if (parsed) {
      syncFromRgb(parsed.r, parsed.g, parsed.b);
      setRgbError('');
    } else if (val.length > 2) {
      setRgbError('Invalid RGB');
    }
  };

  const handleHslChange = (val: string) => {
    setHsl(val);
    setHslError('');
    const parsed = parseHsl(val);
    if (parsed) {
      const { r, g, b } = hslToRgb(parsed.h, parsed.s, parsed.l);
      syncFromRgb(r, g, b);
      setHslError('');
    } else if (val.length > 2) {
      setHslError('Invalid HSL');
    }
  };

  const handlePickerChange = (val: string) => {
    const parsed = hexToRgb(val);
    if (!parsed) return;
    const { r, g, b } = parsed;
    syncFromRgb(r, g, b);
    setHexError('');
    setRgbError('');
    setHslError('');
  };

  const handleCopy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        {/* Color picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_picker}
          </label>
          <input
            type="color"
            value={preview}
            onChange={(e) => handlePickerChange(e.target.value)}
            className="w-full h-20 rounded-xl cursor-pointer border dark:border-gray-700 bg-white dark:bg-gray-800 p-1"
            style={{ minHeight: '80px' }}
          />
        </div>

        {/* Preview square */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_preview}
          </label>
          <div
            className="w-full h-16 rounded-xl border dark:border-gray-700"
            style={{ backgroundColor: preview }}
          />
        </div>

        {/* HEX input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_hex}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-sm"
              placeholder="#RRGGBB"
            />
            <button
              onClick={() => handleCopy(hex, 'hex')}
              title={dict.btn_copy}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            >
              {copied === 'hex' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
          {hexError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{hexError}</p>}
        </div>

        {/* RGB input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_rgb}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={rgb}
              onChange={(e) => handleRgbChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-sm"
              placeholder="rgb(0, 0, 0)"
            />
            <button
              onClick={() => handleCopy(rgb, 'rgb')}
              title={dict.btn_copy}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            >
              {copied === 'rgb' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
          {rgbError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{rgbError}</p>}
        </div>

        {/* HSL input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.label_hsl}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hsl}
              onChange={(e) => handleHslChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-sm"
              placeholder="hsl(0, 0%, 0%)"
            />
            <button
              onClick={() => handleCopy(hsl, 'hsl')}
              title={dict.btn_copy}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            >
              {copied === 'hsl' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
          {hslError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{hslError}</p>}
        </div>

        {copied && (
          <p className="text-sm text-green-500 dark:text-green-400">{dict.copied}</p>
        )}
      </div>
    </div>
  );
}
