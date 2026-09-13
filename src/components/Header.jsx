import React from 'react';
import { Calendar as CalendarIcon, Trophy, Flame, Download, RefreshCw, Moon, Sun, Sparkles, Image as ImageIcon, RotateCcw, BookOpen } from 'lucide-react';
import SplitFlapCounter from './SplitFlapCounter';

export default function Header({ 
  currentYear, 
  currentMonth, 
  onPrevMonth, 
  onNextMonth, 
  onToday,
  stats, 
  theme, 
  onToggleTheme,
  onResetData,
  onClearAllData,
  onOpenProofModal,
  activeTab,
  onSelectTab
}) {
  return (
    <header className="glass-panel" style={{ padding: '20px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Title & Mascot Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(3,199,90,0.2) 0%, rgba(255,184,0,0.2) 100%)',
            border: '1px solid rgba(3,199,90,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(3,199,90,0.25)'
          }}>
            <img src="/mascot.png" alt="Naver Blog Runner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-green">
                <Sparkles size={12} /> 네이버 블로그 챌린지
              </span>
              <span className="badge badge-gold">
                <Flame size={12} className="animate-flame" /> 1일 3포 완주 프로젝트
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.5px' }}>
              월간 <span style={{ color: 'var(--naver-green)' }}>1일 3포</span> 캘린더
            </h1>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={activeTab === 'dashboard' ? 'btn btn-naver' : 'btn btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <CalendarIcon size={16} /> 캘린더 대시보드
          </button>
          <button
            onClick={() => onSelectTab('trophy')}
            className={activeTab === 'trophy' ? 'btn btn-gold' : 'btn btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Trophy size={16} /> 명예의 전당 갤러리
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={activeTab === 'guide' ? 'btn btn-blue' : 'btn btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <BookOpen size={16} /> 포스팅 가이드 💡
          </button>
        </div>

        {/* Center: Month Selector & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button onClick={onPrevMonth} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            &lt; 이전달
          </button>
          
          <div style={{ textAlign: 'center', minWidth: '130px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px' }}>
              {currentYear}년 {currentMonth}월
            </span>
          </div>

          <button onClick={onNextMonth} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            다음달 &gt;
          </button>

          <button onClick={onToday} className="btn btn-naver" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            오늘
          </button>
        </div>

        {/* Right: Quick Action Buttons & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Streak Counter Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: stats.streak > 0 
              ? 'linear-gradient(135deg, rgba(255,87,34,0.25) 0%, rgba(255,45,85,0.25) 100%)' 
              : 'rgba(255,255,255,0.05)',
            border: stats.streak > 0 
              ? '1px solid rgba(255,87,34,0.5)' 
              : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: stats.streak > 0 ? '0 0 15px rgba(255,87,34,0.3)' : 'none',
            transition: 'all 0.3s'
          }}>
            <Flame size={18} className={stats.streak > 0 ? "animate-flame" : ""} style={{ color: stats.streak > 0 ? '#FF5722' : 'var(--text-muted)' }} />
            <SplitFlapCounter value={stats.streak} label="일 연속 달성!" color={stats.streak > 0 ? '#FF7043' : 'var(--text-muted)'} />
          </div>

          {/* Proof Card Generator Button */}
          <button onClick={onOpenProofModal} className="btn btn-gold" title="네이버 블로그 인증 카드 생성">
            <ImageIcon size={16} />
            <span>블로그 인증샷 생성</span>
          </button>

          {/* Full Calendar Clear / Reset Button */}
          <button onClick={onClearAllData} className="btn btn-danger" title={activeTab === 'trophy' ? "1년 12개 월 전체 기록 일괄 초기화" : "선택월 전체 기록 초기화"}>
            <RotateCcw size={16} />
            <span>{activeTab === 'trophy' ? "12개 월 전체 초기화" : "전체 초기화"}</span>
          </button>

          {/* Sample Data Load Button */}
          <button onClick={onResetData} className="btn btn-secondary" title="샘플 데이터 다시 채우기" style={{ padding: '10px 14px' }}>
            <RefreshCw size={16} />
            <span>샘플 불러오기</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={onToggleTheme} className="btn btn-secondary" style={{ padding: '10px' }} title="테마 변경">
            {theme === 'dark' ? <Sun size={16} style={{ color: '#FFB800' }} /> : <Moon size={16} />}
          </button>
        </div>

      </div>
    </header>
  );
}
