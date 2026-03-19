'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';

const DANGEROUS_PROTOCOLS = ['javascript', 'data', 'vbscript', 'file'];

const hasDangerousScheme = (input: string): boolean => {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const protocol = url.protocol.replace(':', '').toLowerCase();
    return DANGEROUS_PROTOCOLS.includes(protocol);
  } catch {
    // Not a valid URL — check raw string after decoding to catch encoded bypasses
    const decoded = decodeURIComponent(trimmed).toLowerCase().replace(/\s/g, '');
    return DANGEROUS_PROTOCOLS.some(p => decoded.startsWith(p + ':'));
  }
};

interface QRCodeGeneratorProps {
  dict: {
    label_enter_text: string;
    placeholder_text: string;
    btn_download: string;
    label_qr_code: string;
    error_dangerous_url: string;
  }
}

const QRCodeGenerator = ({ dict }: QRCodeGeneratorProps) => {
  const [text, setText] = useState<string>('https://example.com');
  const qrRef = useRef<HTMLDivElement>(null);
  const isDangerous = hasDangerousScheme(text);

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_enter_text}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={dict.placeholder_text}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px] text-gray-900 dark:text-gray-100"
            />
          </div>

          {isDangerous && (
            <p className="text-sm text-red-500 dark:text-red-400 font-medium px-1">
              ⚠️ {dict.error_dangerous_url}
            </p>
          )}

          <button
            onClick={downloadQRCode}
            disabled={!text || isDangerous}
            className="w-full py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Download size={20} />
            {dict.btn_download}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 self-start md:self-center">
            {dict.label_qr_code}
          </div>
          <div 
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 dark:border-gray-700"
          >
            {text && !isDangerous ? (
              <QRCodeSVG
                value={text}
                size={200}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                <QrCode size={64} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
