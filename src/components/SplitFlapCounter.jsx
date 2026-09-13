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
      <div style={{ display: 'flex', gap: '3px', perspective: '300px' }}>
        {digits.map((digit, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: '26px',
              height: '34px',
              background: 'linear-gradient(180deg, #161B22 0%, #0D1117 50%, #080A0E 51%, #1F242C 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              transformStyle: 'preserve-3d',
              transform: isFlipping ? 'rotateX(-90deg)' : 'rotateX(0deg)',
              transition: `transform 0.18s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 60}ms`,
              userSelect: 'none'
            }}
          >
            <span>{digit}</span>
            {/* Split Line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'rgba(0,0,0,0.8)',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }} />
          </div>
        ))}
      </div>
      {label && <span style={{ marginLeft: '2px' }}>{label}</span>}
    </div>
  );
}
