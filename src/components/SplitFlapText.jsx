import React, { useState, useEffect, useRef } from 'react';

// Random scramble characters for airport board flipping effect
const SCRAMBLE_CHARS = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하', '1', '2', '3', '4', '7', '8', '9', '🔥', '⚡', '🏆', '💰', '★', '✈️'];

function getRandomScrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

// Web Audio API tick click sound generator for mechanical feel
function playMechanicalTick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.012);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.012);
  } catch (e) {
    // Ignore audio autoplay restrictions if user hasn't interacted
  }
}

// Single Solari Flap Tile Component
function SolariTile({ targetChar, index, totalLength, isParentFlipping }) {
  const [displayedChar, setDisplayedChar] = useState(targetChar);
  const [topChar, setTopChar] = useState(targetChar);
  const [bottomChar, setBottomChar] = useState(targetChar);
  const [isFlippingTile, setIsFlippingTile] = useState(false);

  const prevCharRef = useRef(targetChar);

  useEffect(() => {
    if (prevCharRef.current !== targetChar || isParentFlipping) {
      // Start mechanical scramble & flip sequence for this tile
      const delay = Math.min(index * 22, 600); // Cascade wave delay per character index
      const totalFlaps = 4 + (index % 3); // 4~6 intermediate flaps per character
      let currentFlap = 0;

      const timer = setTimeout(() => {
        setIsFlippingTile(true);
        
        const scrambleInterval = setInterval(() => {
          currentFlap++;
          playMechanicalTick();

          if (currentFlap >= totalFlaps) {
            clearInterval(scrambleInterval);
            setDisplayedChar(targetChar);
            setTopChar(targetChar);
            setBottomChar(targetChar);
            setIsFlippingTile(false);
            prevCharRef.current = targetChar;
          } else {
            const nextScramble = getRandomScrambleChar();
            setTopChar(nextScramble);
            setDisplayedChar(nextScramble);
          }
        }, 45); // 45ms per flap turn

        return () => clearInterval(scrambleInterval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [targetChar, isParentFlipping, index]);

  const isEmoji = ['🔥', '⚡', '🏆', '💰', '🚀', '💡', '🏃', '✨', '👑', '✈️', '★'].includes(displayedChar);
  const isSpace = displayedChar === ' ' || !displayedChar;

  if (isSpace) {
    return <span style={{ display: 'inline-block', width: '8px' }}>&nbsp;</span>;
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: isEmoji ? '22px' : '17px',
        height: '24px',
        margin: '1px 1.5px',
        perspective: '400px',
        userSelect: 'none'
      }}
    >
      {/* Tile Background Base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1A202C 0%, #11151C 49%, #090C10 50%, #151B24 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '4px',
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Main Display Character */}
        <span
          style={{
            color: isEmoji ? '#FFB800' : '#F8FAFC',
            fontSize: '0.82rem',
            fontWeight: 800,
            fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
            lineHeight: 1,
            textShadow: isEmoji ? '0 0 8px rgba(255,184,0,0.5)' : '0 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          {displayedChar}
        </span>

        {/* Top Half Highlight Reflection Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Solari Mechanical Center Split Line & Hinge Notch */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: '#000000',
            boxShadow: '0 1px 0 rgba(255, 255, 255, 0.1)',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        />

        {/* Left / Right Mechanical Hinge Clips */}
        <div style={{ position: 'absolute', top: 'calc(50% - 2px)', left: 0, width: '2px', height: '4px', background: '#334155', borderRadius: '0 2px 2px 0', zIndex: 5 }} />
        <div style={{ position: 'absolute', top: 'calc(50% - 2px)', right: 0, width: '2px', height: '4px', background: '#334155', borderRadius: '2px 0 0 2px', zIndex: 5 }} />
      </div>

      {/* 3D Animated Top Flap Drop Overlay */}
      {isFlippingTile && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, #242C3B 0%, #151B24 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0',
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            animation: 'solariFlapDown 0.08s ease-in forwards',
            zIndex: 6,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              color: isEmoji ? '#FFB800' : '#F8FAFC',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: "'Outfit', 'Noto Sans KR', sans-serif",
              marginTop: '4px'
            }}
          >
            {topChar}
          </span>
        </div>
      )}
    </div>
  );
}

export default function SplitFlapText({ text, fontSize = '0.85rem' }) {
  const [currentText, setCurrentText] = useState(text || '');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (text !== currentText) {
      setIsFlipping(true);
      setCurrentText(text || '');
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [text, currentText]);

  const chars = (currentText || '').split('');

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '1px',
        alignItems: 'center',
        padding: '6px 8px',
        background: 'rgba(8, 11, 16, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      {chars.map((char, idx) => (
        <SolariTile
          key={idx}
          targetChar={char}
          index={idx}
          totalLength={chars.length}
          isParentFlipping={isFlipping}
        />
      ))}

      {/* Keyframe stylesheet for 3D flap animation */}
      <style>{`
        @keyframes solariFlapDown {
          0% {
            transform: rotateX(0deg);
            filter: brightness(1);
          }
          50% {
            filter: brightness(0.7);
          }
          100% {
            transform: rotateX(-90deg);
            filter: brightness(0.4);
          }
        }
      `}</style>
    </div>
  );
}
