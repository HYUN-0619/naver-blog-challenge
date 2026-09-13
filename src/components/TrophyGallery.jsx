import React from 'react';
import { Trophy, Award, Lock, Sparkles, Flame, CheckCircle2, Star, Download, ShieldCheck, RotateCcw } from 'lucide-react';
import { calculateStats } from '../utils/storage';

export default function TrophyGallery({ challengeData, year, onSelectMonth, onOpenProofModal, onClearYearData }) {
  const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

  // Calculate monthly stats for all 12 months
  const monthlyStats = MONTHS.map(m => {
    const stats = calculateStats(challengeData, year, m);
    return {
      month: m,
      ...stats
    };
  });

  const completedMonthsCount = monthlyStats.filter(m => m.progressPercent === 100).length;
  const totalPostsYear = monthlyStats.reduce((acc, m) => acc + m.totalPostsCompleted, 0);

  // Blogger Tier Title
  let tierTitle = '🥉 브론즈 블로거';
  let tierColor = '#CD7F32';
  if (completedMonthsCount >= 12) {
    tierTitle = '👑 전설의 1일 3포 마스터';
    tierColor = '#FFD700';
  } else if (completedMonthsCount >= 9) {
    tierTitle = '💎 다이아몬드 블로거';
    tierColor = '#00E5FF';
  } else if (completedMonthsCount >= 6) {
    tierTitle = '🥇 골드 블로거';
    tierColor = '#FFB800';
  } else if (completedMonthsCount >= 3) {
    tierTitle = '🥈 실버 블로거';
    tierColor = '#C0C0C0';
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      
      {/* Top Hall of Fame Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-gold">
                <Sparkles size={14} /> {year}년 명예의 전당
              </span>
              <span className="badge badge-green">
                <ShieldCheck size={14} /> 완주 트로피 보관함
              </span>
              {onClearYearData && (
                <button
                  onClick={onClearYearData}
                  className="btn btn-danger"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  title="1년 12개 월 전체 기록 일괄 초기화"
                >
                  <RotateCcw size={13} /> 12개 월 전체 초기화
                </button>
              )}
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '8px', letterSpacing: '-0.5px' }}>
              월간 완주 <span style={{ color: 'var(--gold-primary)' }}>트로피 갤러리</span> 🏆
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              매월 1일 3포 챌린지를 완주하여 골드 트로피 뱃지를 수집하고 레전드 블로거로 등극하세요!
            </p>
          </div>

          {/* User Tier & Summary Stats Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(255,184,0,0.12) 0%, rgba(3,199,90,0.12) 100%)',
            border: '2px solid var(--gold-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 24px',
            boxShadow: '0 0 25px rgba(255,184,0,0.3)'
          }}>
            <div style={{ fontSize: '2.5rem' }}>🏆</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600 }}>현재 블로거 등급</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: tierColor, marginTop: '2px' }}>
                {tierTitle}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                <span>완주 월: <strong style={{ color: 'var(--gold-primary)' }}>{completedMonthsCount} / 12개월</strong></span>
                <span>총 작성글: <strong style={{ color: 'var(--naver-green-light)' }}>{totalPostsYear}포</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 12 Months Trophy Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {monthlyStats.map(m => {
          const isCompleted = (m.progressPercent === 100);
          const hasStarted = (m.totalPostsCompleted > 0);

          return (
            <div
              key={m.month}
              className="glass-panel"
              style={{
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                background: isCompleted 
                  ? 'linear-gradient(145deg, rgba(255, 184, 0, 0.15) 0%, rgba(3, 199, 90, 0.12) 100%)'
                  : hasStarted 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.3)',
                border: isCompleted 
                  ? '2px solid var(--gold-primary)'
                  : hasStarted 
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px dashed rgba(255, 255, 255, 0.1)',
                boxShadow: isCompleted ? '0 0 20px rgba(255, 184, 0, 0.3)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {/* Top Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: isCompleted ? 'var(--gold-primary)' : 'var(--text-main)' }}>
                  {year}년 {m.month}월
                </span>

                {isCompleted ? (
                  <span className="badge badge-gold animate-flame">
                    <Trophy size={12} /> 완주 획득!
                  </span>
                ) : hasStarted ? (
                  <span className="badge badge-green">
                    {m.progressPercent}% 진행 중
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={12} /> 미달성
                  </span>
                )}
              </div>

              {/* Center Trophy Icon & Badge */}
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                {isCompleted ? (
                  <div className="animate-float" style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{
                      fontSize: '3.5rem',
                      filter: 'drop-shadow(0 0 15px rgba(255, 184, 0, 0.8))'
                    }}>
                      🏆
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gold-gradient)',
                      color: '#000',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {m.month}월 3포 마스터
                    </div>
                  </div>
                ) : hasStarted ? (
                  <div style={{ fontSize: '3rem', opacity: 0.6, filter: 'grayscale(50%)' }}>
                    🥉
                  </div>
                ) : (
                  <div style={{ fontSize: '3rem', opacity: 0.2 }}>
                    🔒
                  </div>
                )}
              </div>

              {/* Progress Detail Bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--text-sub)' }}>
                  <span>달성률</span>
                  <strong>{m.totalPostsCompleted} / {m.totalPostsGoal} 포스팅</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${m.progressPercent}%`,
                    height: '100%',
                    background: isCompleted ? 'var(--gold-gradient)' : 'var(--naver-green)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onSelectMonth(m.month)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px', fontSize: '0.78rem' }}
                >
                  달력 보기
                </button>
                {isCompleted && (
                  <button
                    onClick={() => onOpenProofModal(m.month)}
                    className="btn btn-gold"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    title="완주 인증서 다운로드"
                  >
                    <Download size={14} />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
