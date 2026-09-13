import React, { useState, useEffect } from 'react';

export default function SplitFlapText({ text, fontSize = '0.9rem', minChars = 0 }) {
  const [displayText, setDisplayText] = useState(text || '');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (text !== displayText) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayText(text || '');
        setIsFlipping(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [text, displayText]);

  const chars = (displayText || '').split('');

  return (
    <div 
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '2px',
        alignItems: 'center',
        perspective: '400px',
        fontFamily: "'Outfit', 'Noto Sans KR', sans-serif"
      }}
    >
      {chars.map((char, idx) => (
        <span
          key={idx}
          style={{
            position: 'relative',
            display: 'inline-block',
            padding: '2px 4px',
            background: 'linear-gradient(180deg, #1C2128 0%, #0D1117 50%, #0B0E14 51%, #161B22 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '4px',
            color: char === '🔥' || char === '⚡' || char === '🏆' || char === '💰' ? '#FFB800' : 'var(--text-main)',
            fontSize: fontSize,
            fontWeight: 700,
            lineHeight: 1.2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            transformStyle: 'preserve-3d',
            transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
            transition: `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 15}ms`,
            userSelect: 'none'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
          {/* Solari Split Line Center Divider */}
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'rgba(0,0,0,0.7)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              pointerEvents: 'none'
            }}
          />
        </span>
      ))}
    </div>
  );
}
