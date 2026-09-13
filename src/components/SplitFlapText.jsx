import React, { useState, useEffect, useRef } from 'react';

// Web Audio API tick click sound generator for 3D drum reel
function playDrumTick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {
    // Autoplay restrictions ignored if no user interaction yet
  }
}

export default function SplitFlapText({ text, fontSize = '0.88rem' }) {
  const [displayText, setDisplayText] = useState(text || '');
  const [prevText, setPrevText] = useState(text || '');
  const [isSpinning, setIsSpinning] = useState(false);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      setPrevText(prevTextRef.current || text);
      setIsSpinning(true);

      // Play rapid mechanical tick ticks during 3D reel spin
      let ticks = 0;
      const tickInterval = setInterval(() => {
        playDrumTick();
        ticks++;
        if (ticks >= 7) clearInterval(tickInterval);
      }, 50);

      const timer = setTimeout(() => {
        setDisplayText(text);
        setIsSpinning(false);
        prevTextRef.current = text;
      }, 450);

      return () => {
        clearTimeout(timer);
        clearInterval(tickInterval);
      };
    }
  }, [text]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '42px',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        overflow: 'hidden',
        borderRadius: '8px',
        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.9) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(8, 12, 20, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.8), 0 4px 15px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        userSelect: 'none'
      }}
    >
      {/* 3D Drum Reel Rotating Container */}
      <div
        style={{
          width: '100%',
          transformStyle: 'preserve-3d',
          transform: isSpinning ? 'rotateX(-90deg) scale(0.96)' : 'rotateX(0deg) scale(1)',
          filter: isSpinning ? 'blur(2.5px)' : 'blur(0px)',
          opacity: isSpinning ? 0.7 : 1,
          transition: isSpinning
            ? 'transform 0.45s cubic-bezier(0.15, 0.85, 0.35, 1.25), filter 0.2s ease, opacity 0.2s ease'
            : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease, opacity 0.15s ease',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: '#F8FAFC',
            fontSize: fontSize,
            fontWeight: 700,
            fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
            lineHeight: 1.35,
            letterSpacing: '-0.2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}
        >
          {isSpinning ? prevText : displayText}
        </span>
      </div>

      {/* Top Metallic Glass Shadow Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* Bottom Metallic Glass Shadow Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '12px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* Center 3D Reel Slot Highlight Beam */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 184, 0, 0.3) 30%, rgba(3, 199, 90, 0.4) 50%, rgba(255, 184, 0, 0.3) 70%, transparent 100%)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 6
        }}
      />
    </div>
  );
}
