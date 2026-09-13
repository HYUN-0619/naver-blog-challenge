import React, { useState, useEffect, useRef } from 'react';

// Web Audio API drum tick for counter numbers
function playDrumCounterTick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.012);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.012);
  } catch (e) {
    // Autoplay restrictions ignored if no prior user interaction
  }
}

function DrumDigit({ targetDigit, index, isSpinningParent, color }) {
  const [displayedDigit, setDisplayedDigit] = useState(targetDigit);
  const [isSpinning, setIsSpinning] = useState(false);
  const prevDigitRef = useRef(targetDigit);

  useEffect(() => {
    if (targetDigit !== prevDigitRef.current || isSpinningParent) {
      const delay = index * 40;
      const timer = setTimeout(() => {
        setIsSpinning(true);
        playDrumCounterTick();

        const spinTimer = setTimeout(() => {
          setDisplayedDigit(targetDigit);
          setIsSpinning(false);
          prevDigitRef.current = targetDigit;
        }, 220);

        return () => clearTimeout(spinTimer);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [targetDigit, isSpinningParent, index]);

  return (
    <div
      style={{
        position: 'relative',
        width: '28px',
        height: '38px',
        background: 'linear-gradient(180deg, #18202C 0%, #0D121B 50%, #151C27 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.5)',
        perspective: '600px',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 3D Revolving Cylinder Digit Drum */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: isSpinning ? 'rotateX(-180deg) scale(0.9)' : 'rotateX(0deg) scale(1)',
          filter: isSpinning ? 'blur(2px)' : 'blur(0px)',
          transition: isSpinning
            ? 'transform 0.22s cubic-bezier(0.15, 0.85, 0.35, 1.2), filter 0.15s ease'
            : 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          style={{
            color: color,
            fontSize: '1.35rem',
            fontWeight: 900,
            fontFamily: "'Outfit', sans-serif",
            textShadow: `0 0 10px ${color}66`
          }}
        >
          {displayedDigit}
        </span>
      </div>

      {/* Top Glass Reflection */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />

      {/* Center Drum Highlight Divider */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default function SplitFlapCounter({ value, label = '', color = 'var(--naver-green)' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsSpinning(true);
      setDisplayValue(value);
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const digits = String(displayValue).padStart(2, '0').split('');

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {digits.map((digit, idx) => (
          <DrumDigit
            key={idx}
            targetDigit={digit}
            index={idx}
            isSpinningParent={isSpinning}
            color={color}
          />
        ))}
      </div>
      {label && <span style={{ marginLeft: '4px', fontWeight: 700, fontSize: '0.88rem' }}>{label}</span>}
    </div>
  );
}
