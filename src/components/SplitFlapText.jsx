import React, { useState, useEffect } from 'react';

export default function SplitFlapText({ text, fontSize = '0.85rem' }) {
  const [displayText, setDisplayText] = useState(text || '');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (text !== displayText) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayText(text || '');
        setIsFlipping(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [text, displayText]);

  const chars = (displayText || '').split('');

  return (
    <div 
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '3px',
        alignItems: 'center',
        perspective: '600px',
        fontFamily: "'Outfit', 'Noto Sans KR', sans-serif"
      }}
    >
      {chars.map((char, idx) => {
        const isEmoji = char === '🔥' || char === '⚡' || char === '🏆' || char === '💰' || char === '🚀' || char === '💡' || char === '🏃' || char === '✨' || char === '👑';
        
        return (
          <span
            key={idx}
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 5px',
              background: 'linear-gradient(180deg, #1C222D 0%, #111620 49%, #0B0E15 50%, #181E2A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: isEmoji ? '#FFB800' : '#F1F5F9',
              fontSize: fontSize,
              fontWeight: 700,
              lineHeight: 1.25,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              transformStyle: 'preserve-3d',
              transform: isFlipping ? 'rotateX(-90deg)' : 'rotateX(0deg)',
              transition: `transform 0.22s cubic-bezier(0.4, 0, 0.2, 1) ${Math.min(idx * 12, 400)}ms`,
              userSelect: 'none'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
            
            {/* Solari Mechanical Center Split Line */}
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: '1px',
                background: 'rgba(0, 0, 0, 0.85)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                pointerEvents: 'none'
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

