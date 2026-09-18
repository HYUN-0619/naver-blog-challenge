import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Flame, Zap, Radio, CheckCircle, FileText } from 'lucide-react';
import { fetchGlobalChallengeStats } from '../utils/challenge';

export default function GlobalActivityBanner() {
  const [stats, setStats] = useState({
    todayPosts: 0,
    todayFinishers: 0,
    totalPosts: 0,
    recentEvents: []
  });

  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // Fetch stats initially and poll every 30 seconds
  useEffect(() => {
    let isMounted = true;

    const loadStats = () => {
      fetchGlobalChallengeStats().then(data => {
        if (isMounted && data) {
          setStats({
            todayPosts: data.todayPosts ?? 0,
            todayFinishers: data.todayFinishers ?? 0,
            totalPosts: data.totalPosts ?? 0,
            recentEvents: data.recentEvents ?? []
          });
        }
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Rolling ticker cycle every 4 seconds
  useEffect(() => {
    if (!stats.recentEvents || stats.recentEvents.length === 0) return;
    const tickerTimer = setInterval(() => {
      setCurrentTickerIndex(prev => (prev + 1) % stats.recentEvents.length);
    }, 4000);

    return () => clearInterval(tickerTimer);
  }, [stats.recentEvents]);

  const currentEvent = stats.recentEvents?.[currentTickerIndex];

  return (
    <div className="glass-panel" style={{
      padding: '18px 24px',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, rgba(3, 199, 90, 0.08) 0%, rgba(255, 184, 0, 0.08) 100%)',
      border: '1px solid rgba(3, 199, 90, 0.35)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      borderRadius: 'var(--radius-lg)'
    }}>
      
      {/* Top Title & Metrics Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
        
        {/* Title & Live Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(3,199,90,0.25) 0%, rgba(255,184,0,0.2) 100%)',
            border: '1px solid rgba(3,199,90,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--naver-green)'
          }}>
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
                전국 챌린저 실시간 합산 현황
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                borderRadius: '8px',
                fontSize: '0.68rem',
                fontWeight: 800,
                background: 'rgba(3,199,90,0.18)',
                border: '1px solid rgba(3,199,90,0.4)',
                color: 'var(--naver-green-light)'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--naver-green)', display: 'inline-block', boxShadow: '0 0 6px var(--naver-green)' }} />
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', marginTop: '2px' }}>
              전국의 블로거들이 오늘 함께 달성한 포스팅 기록이 실시간으로 합산됩니다.
            </div>
          </div>
        </div>

        {/* 3 Metric Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Today Total Posts */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 208, 255, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <FileText size={12} style={{ color: '#00D0FF' }} /> 오늘 작성된 글
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00D0FF', fontFamily: "'Outfit', sans-serif" }}>
              {stats.todayPosts.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>개</span>
            </div>
          </div>

          {/* Today 3-Post Finishers */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 184, 0, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Trophy size={12} style={{ color: 'var(--gold-primary)' }} /> 오늘 3포 완주자
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--gold-primary)', fontFamily: "'Outfit', sans-serif" }}>
              {stats.todayFinishers.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>명</span>
            </div>
          </div>

          {/* All-time Completed Posts */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(3, 199, 90, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--naver-green-light)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={12} style={{ color: 'var(--naver-green)' }} /> 누적 완주 기록
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--naver-green-light)', fontFamily: "'Outfit', sans-serif" }}>
              {stats.totalPosts.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>개</span>
            </div>
          </div>

        </div>

      </div>

      {/* Live Rolling Ticker Strip */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--gold-primary)',
          flexShrink: 0
        }}>
          <Sparkles size={14} /> 라이브 완주 피드
        </div>

        <div style={{
          width: '1px',
          height: '14px',
          background: 'var(--border-color)',
          flexShrink: 0
        }} />

        <div style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: '0.84rem',
          color: 'var(--text-main)',
          transition: 'all 0.3s ease-in-out'
        }}>
          {currentEvent ? (
            currentEvent.event_type === 'day_finished' ? (
              <span>
                🏆 <strong style={{ color: 'var(--gold-primary)' }}>[{currentEvent.nickname}]</strong>님이 오늘 <strong style={{ color: 'var(--naver-green-light)' }}>1일 3포 완주</strong>에 성공했습니다! 완주를 축하합니다! 🔥
              </span>
            ) : (
              <span>
                ✨ <strong style={{ color: '#00D0FF' }}>[{currentEvent.nickname}]</strong>님이 <span style={{ color: 'var(--text-sub)' }}>{currentEvent.post_number}번째 글</span> {currentEvent.post_title ? `("${currentEvent.post_title}")` : ''} ({currentEvent.category}) 작성을 완료했습니다! 👏
              </span>
            )
          ) : (
            <span style={{ color: 'var(--text-sub)' }}>
              오늘의 첫 1포를 등록하고 전국의 블로거들에게 동기부여를 선물해 보세요! 🚀
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
