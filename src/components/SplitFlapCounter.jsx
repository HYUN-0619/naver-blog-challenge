import React, { useState, useEffect, useRef } from 'react';

// Web Audio API tick sound for counter numbers
function playCounterTick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.01);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
  } catch (e) {
    // Autoplay restrictions ignored if no prior click
  }
}

function CounterDigit({ targetDigit, index, isFlippingParent, color }) {
  const [displayedDigit, setDisplayedDigit] = useState(targetDigit);
  const [isFlippingDigit, setIsFlippingDigit] = useState(false);
  const prevDigitRef = useRef(targetDigit);

  useEffect(() => {
    if (prevDigitRef.current !== targetDigit || isFlippingParent) {
      const delay = index * 50;
      const timer = setTimeout(() => {
        setIsFlippingDigit(true);
        let start = parseInt(prevDigitRef.current, 10) || 0;
        const end = parseInt(targetDigit, 10) || 0;
        
        let current = start;
        const steps = 3;
        let stepCount = 0;

        const interval = setInterval(() => {
          stepCount++;
          playCounterTick();
          current = (current + 1) % 10;
          setDisplayedDigit(String(current));

          if (stepCount >= steps) {
            clearInterval(interval);
            setDisplayedDigit(targetDigit);
            setIsFlippingDigit(false);
            prevDigitRef.current = targetDigit;
          }
        }, 50);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [targetDigit, isFlippingParent, index]);

  return (
    <div
      style={{
        position: 'relative',
        width: '28px',
        height: '36px',
        background: 'linear-gradient(180deg, #1C2330 0%, #0F141D 49%, #080B10 50%, #171E29 100%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '1.35rem',
        fontWeight: 900,
        fontFamily: "'Outfit', sans-serif",
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        perspective: '400px',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <span style={{ textShadow: `0 0 10px ${color}66` }}>{displayedDigit}</span>

      {/* Top Glass Highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />

      {/* Solari Split Line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: '#000000',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.12)',
          pointerEvents: 'none'
        }}
      />

      {/* Hinge Side Clips */}
      <div style={{ position: 'absolute', top: 'calc(50% - 2px)', left: 0, width: '2px', height: '4px', background: '#475569' }} />
      <div style={{ position: 'absolute', top: 'calc(50% - 2px)', right: 0, width: '2px', height: '4px', background: '#475569' }} />

      {/* 3D Flap Motion Overlay */}
      {isFlippingDigit && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, #2A3447 0%, #171E29 100%)',
            borderBottom: '1px solid #000000',
            transformOrigin: 'bottom center',
            animation: 'digitFlap 0.06s ease-in forwards',
            zIndex: 10
          }}
        />
      )}

      <style>{`
        @keyframes digitFlap {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
      `}</style>
    </div>
  );
}

export default function SplitFlapCounter({ value, label = '', color = 'var(--naver-green)' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      setDisplayValue(value);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const digits = String(displayValue).padStart(2, '0').split('');

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {digits.map((digit, idx) => (
          <CounterDigit
            key={idx}
            targetDigit={digit}
            index={idx}
            isFlippingParent={isFlipping}
            color={color}
          />
        ))}
      </div>
      {label && <span style={{ marginLeft: '4px', fontWeight: 700, fontSize: '0.88rem' }}>{label}</span>}
    </div>
  );
}
