import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoldenTimeGuide() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`;

  // Determine current active golden slot
  let activeSlotIndex = 0;
  if (hours >= 11 && hours < 17) {
    activeSlotIndex = 1; // Lunch slot
  } else if (hours >= 17 || hours < 5) {
    activeSlotIndex = 2; // Evening slot
  } else {
    activeSlotIndex = 0; // Morning slot
  }

  const goldenSlots = [
    {
      slot: 1,
      title: '아침 1포',
      time: '08:00',
      icon: <Sunrise size={20} style={{ color: '#FF9800' }} />,
      tag: '출근/등교 검색 유입 피크',
      recommendedCat: '💡 정보성, IT, 뉴스, 직장인 꿀팁',
      tip: '출근길 지하철/버스에서 스마트폰 검색 유입이 급증하는 골든타임입니다.'
    },
    {
      slot: 2,
      title: '점심 2포',
      time: '12:30',
      icon: <Sun size={20} style={{ color: '#FFB800' }} />,
      tag: '점심 휴식시간 유입 피크',
      recommendedCat: '✈️ 맛집, 카페, 🛍️ 제품 리뷰, 체험단',
      tip: '점심 식사 후 커피 한 잔하며 이웃 소통과 맛집 검색이 활성화되는 시간대입니다.'
    },
    {
      slot: 3,
      title: '저녁 3포',
      time: '21:00',
      icon: <Moon size={20} style={{ color: '#9C27B0' }} />,
      tag: '퇴근 후 야간 검색 최다 유입',
      recommendedCat: '🌿 일상, 📈 재테크, 🎨 자기계발, 독서',
      tip: '하루 중 블로그 전체 방문수가 가장 높고 댓글 소통이 가장 활발한 피크타임입니다.'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Title & Realtime Clock Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} style={{ color: 'var(--naver-green)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              네이버 블로그 <span style={{ color: 'var(--gold-primary)' }}>1일 3포 골든 타임</span> 가이드
            </h2>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              <Sparkles size={12} /> 트래픽 피크 가이드
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginTop: '2px' }}>
            방문자 수와 이웃 소통량이 폭발하는 3대 골든 타임에 맞춰 글을 발행하고 상위 노출 기회를 잡으세요!
          </p>
        </div>

        {/* Live Clock Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 16px',
          boxShadow: '0 0 15px var(--naver-green-glow)'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--naver-green-light)', fontWeight: 700 }}>현재 시각</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFFFFF', letterSpacing: '1px' }}>
            {timeStr}
          </span>
        </div>
      </div>

      {/* 3 Golden Time Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {goldenSlots.map((item, idx) => {
          const isActive = (idx === activeSlotIndex);

          return (
            <div
              key={item.slot}
              style={{
                background: isActive 
                  ? 'linear-gradient(145deg, rgba(3, 199, 90, 0.15) 0%, rgba(255, 184, 0, 0.1) 100%)'
                  : 'rgba(0, 0, 0, 0.25)',
                border: isActive ? '2px solid var(--naver-green)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                boxShadow: isActive ? '0 0 20px rgba(3, 199, 90, 0.25)' : 'none'
              }}
            >
              {/* Card Top Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon}
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isActive ? 'var(--gold-primary)' : 'var(--text-main)' }}>
                    {item.title}
                  </span>
                </div>

                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: isActive ? 'var(--naver-green)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#000000' : 'var(--text-sub)'
                }}>
                  {item.time}
                </div>
              </div>

              {/* Tag & Recommendation */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--naver-green-light)', marginBottom: '4px' }}>
                  🎯 {item.tag}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong>추천 주제:</strong> {item.recommendedCat}
                </div>
              </div>

              {/* Tip */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                💡 {item.tip}
              </div>

              {/* Active Indicator Tag */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '16px',
                  background: 'var(--gold-gradient)',
                  color: '#000000',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(255,184,0,0.5)'
                }}>
                  현재 골든 타임 영역
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
