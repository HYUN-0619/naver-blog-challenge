import React from 'react';
import { Trophy, Flag, Flame, Sparkles, CheckCircle2, Award, Zap, ChevronRight } from 'lucide-react';

export default function RunnerTrack({ stats, month, year }) {
  const percent = Math.min(100, Math.max(0, stats.progressPercent));
  const totalDays = stats.totalDaysInMonth || 30;

  // Milestone points definition dynamically adapted to month days (28, 29, 30, 31 days)
  const milestones = [
    { pos: 0, label: '출발선', badge: '🚀', desc: '챌린지 시작!' },
    { pos: 25, label: `${Math.round(totalDays * 0.25)}일 연승`, badge: '🥉', desc: '초반 스퍼트 완료' },
    { pos: 50, label: `${Math.round(totalDays * 0.5)}일 돌파`, badge: '🥈', desc: '월간 50% 반환점' },
    { pos: 75, label: `${Math.round(totalDays * 0.75)}일 고지`, badge: '🥇', desc: '마지막 피니시 라인 전' },
    { pos: 100, label: `${totalDays}일 완주`, badge: '🏆', desc: '1일 3포 챔피언!' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Banner Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} style={{ color: 'var(--naver-green)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {month}월 1일 3포 <span style={{ color: 'var(--gold-primary)' }}>달려가는 그래픽 트랙</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginTop: '2px' }}>
            포스팅을 등록할 때마다 내 블로거 캐릭터가 한 달 목표 피니시 라인을 향해 전속력으로 달려갑니다!
          </p>
        </div>

        {/* Realtime Stat Counters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 600 }}>누적 작성 수</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--naver-green-light)' }}>
              {stats.totalPostsCompleted} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {stats.totalPostsGoal}포</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 600 }}>3포 완주 날짜</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
              {stats.fullCompletedDays} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {stats.totalDaysInMonth}일</span>
            </div>
          </div>

          <div style={{ background: 'rgba(3,199,90,0.12)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(3,199,90,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--naver-green-light)', fontWeight: 700 }}>한달 목표 달성률</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF' }}>
              {percent}%
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Running Track Graphic Box */}
      <div style={{
        position: 'relative',
        padding: '50px 30px 40px 30px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginTop: '10px',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.4)'
      }}>

        {/* Background Track Lines & Stripes */}
        <div style={{
          position: 'absolute',
          top: '65px',
          left: '30px',
          right: '30px',
          height: '24px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden'
        }}>
          {/* Active Progress Track */}
          <div style={{
            width: `${percent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #03C75A 0%, #FFB800 60%, #FF5722 100%)',
            boxShadow: '0 0 20px rgba(3, 199, 90, 0.6)',
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>

        {/* Milestone Flag Markers */}
        <div style={{ position: 'relative', width: '100%', height: '40px' }}>
          {milestones.map((m, idx) => {
            const isReached = percent >= m.pos;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${m.pos}%`,
                  transform: 'translateX(-50%)',
                  top: '-15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  cursor: 'pointer'
                }}
                title={`${m.label}: ${m.desc}`}
              >
                {/* Milestone Badge Icon */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isReached ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' : 'rgba(15,23,42,0.8)',
                  border: isReached ? '2px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  boxShadow: isReached ? '0 0 15px rgba(255,184,0,0.4)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {m.badge}
                </div>

                {/* Milestone Label */}
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginTop: '6px',
                  color: isReached ? 'var(--text-main)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}>
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Blogger Runner Mascot Avatar */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: `calc(30px + (100% - 60px) * ${percent / 100})`,
          transform: 'translateX(-50%)',
          zIndex: 10,
          transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          {/* Runner Cheering Speech Bubble */}
          <div className="animate-float" style={{
            background: 'var(--gold-gradient)',
            color: '#000000',
            padding: '5px 12px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(255, 184, 0, 0.5)',
            marginBottom: '4px',
            position: 'relative'
          }}>
            {percent === 100 ? `🎉 ${totalDays}일 완주 성공! 마스터 블로거!` : `🏃 ${percent}% 달성! (${stats.totalPostsCompleted}포)`}
            {/* Pointer arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #FFB800'
            }} />
          </div>

          {/* Runner Mascot Avatar Image */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid var(--naver-green)',
            boxShadow: '0 0 20px rgba(3, 199, 90, 0.8)',
            background: '#0D1117',
            overflow: 'hidden',
            animation: 'pulseGlow 2s infinite'
          }}>
            <img 
              src="/mascot.png" 
              alt="Runner" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

      </div>

      {/* Motivational Footer Note */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={15} style={{ color: 'var(--gold-primary)' }} />
          <span>목표까지 <strong>{Math.max(0, stats.totalPostsGoal - stats.totalPostsCompleted)}포스팅</strong> 남았습니다! 오늘도 힘차게 달려보세요 🔥</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          마일스톤 아이콘을 클릭해 목표 보상을 확인하세요.
        </div>
      </div>

    </div>
  );
}
