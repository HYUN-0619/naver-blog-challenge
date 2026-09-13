import React, { useState, useEffect } from 'react';

export default function SplitFlapCounter({ value, label = '', color = 'var(--naver-green)' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const digits = String(displayValue).padStart(2, '0').split('');

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '3px', perspective: '400px' }}>
        {digits.map((digit, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: '26px',
              height: '34px',
              background: 'linear-gradient(180deg, #1C222D 0%, #0F141C 49%, #080B10 50%, #1A202C 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
              boxShadow: '0 4px 10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
              transformStyle: 'preserve-3d',
              transform: isFlipping ? 'rotateX(-90deg)' : 'rotateX(0deg)',
              transition: `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 60}ms`,
              userSelect: 'none'
            }}
          >
            <span>{digit}</span>
            {/* Solari Counter Split Line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'rgba(0, 0, 0, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              pointerEvents: 'none'
            }} />
          </div>
        ))}
      </div>
      {label && <span style={{ marginLeft: '2px', fontWeight: 600 }}>{label}</span>}
    </div>
  );
}

