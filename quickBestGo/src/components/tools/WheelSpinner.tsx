'use client';

import React, { useState, useRef } from 'react';
import { RotateCw, Trash2 } from 'lucide-react';

interface WheelSpinnerProps {
  dict: {
    label_enter_options: string;
    placeholder_options: string;
    btn_spinning: string;
    btn_spin: string;
    label_winner: string;
    error_min_options: string;
  }
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
  '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#FF8A65',
  '#7986CB', '#9575CD', '#4FC3F7', '#DCE775', '#A1887F'
];

// Remove control characters and limit length per item to prevent XSS via SVG injection
const sanitizeItem = (item: string): string =>
  item.replace(/[\x00-\x1F\x7F<>&"']/g, '').trim().substring(0, 100);

const WheelSpinner = ({ dict }: WheelSpinnerProps) => {
  const [itemsInput, setItemsInput] = useState<string>(dict.placeholder_options);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const items = itemsInput.split('\n').map(sanitizeItem).filter(i => i !== '');

  const spin = () => {
    if (items.length < 2) {
      alert(dict.error_min_options);
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full spins
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (extraSpins * 360) + randomDegree;
    
    setRotation(totalRotation);

    // Calculate winner after animation
    setTimeout(() => {
      setIsSpinning(false);
      
      // The needle is at the top (270 degrees in SVG coordinate system if 0 is right)
      // But we rotate the wheel clockwise.
      // Final effective rotation is (totalRotation % 360)
      // The segment at the top (needle) is determined by:
      const actualRotation = totalRotation % 360;
      // The wheel starts with the first segment at 0 degrees (pointing right).
      // If we rotate by 'actualRotation' clockwise, the point at the top (270 deg)
      // was originally at (270 - actualRotation) % 360.
      let normalizedAngle = (270 - actualRotation) % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;
      
      const segmentAngle = 360 / items.length;
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
      setWinner(items[winnerIndex]);
    }, 4000); // Match CSS transition duration
  };

  const renderWheel = () => {
    const segmentAngle = 360 / items.length;
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0.5" dy="0.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g style={{ 
          transform: `rotate(${rotation}deg)`, 
          transformOrigin: '50% 50%',
          transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)'
        }}>
          {items.map((item, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            
            const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const textAngle = startAngle + segmentAngle / 2;
            const textX = 50 + 30 * Math.cos((textAngle * Math.PI) / 180);
            const textY = 50 + 30 * Math.sin((textAngle * Math.PI) / 180);
            
            return (
              <g key={i}>
                <path 
                  d={pathData} 
                  fill={COLORS[i % COLORS.length]} 
                  stroke="white" 
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize={items.length > 10 ? "3" : "4"}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {item.length > 8 ? item.substring(0, 7) + '...' : item}
                </text>
              </g>
            );
          })}
        </g>
        {/* Needle */}
        <path 
          d="M 50 5 L 47 0 L 53 0 Z" 
          fill="#1e40af" 
          filter="url(#shadow)"
          className="drop-shadow-md"
        />
        <circle cx="50" cy="50" r="4" fill="white" stroke="#1e40af" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_enter_options}</label>
            <button 
              onClick={() => setItemsInput('')}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={itemsInput}
            onChange={(e) => setItemsInput(e.target.value)}
            rows={4}
            placeholder={dict.placeholder_options}
            className="w-full px-4 py-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center justify-center py-4 relative">
          <div ref={wheelRef} className="w-64 h-64 relative">
            {items.length > 0 ? renderWheel() : (
              <div className="w-full h-full border-8 border-dashed border-gray-100 dark:border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={isSpinning || items.length < 2}
          className="w-full py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <RotateCw size={20} className={isSpinning ? 'animate-spin' : ''} />
          {isSpinning ? dict.btn_spinning : dict.btn_spin}
        </button>

        {winner && !isSpinning && (
          <div className="text-center py-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 animate-in zoom-in duration-300">
            <span className="text-sm text-blue-400 dark:text-blue-300 block mb-1 font-bold uppercase tracking-widest">{dict.label_winner}</span>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {winner}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelSpinner;
