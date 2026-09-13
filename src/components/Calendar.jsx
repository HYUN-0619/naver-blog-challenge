import React from 'react';
import { Flame, CheckCircle2, FileText, Zap, Sparkles, PlusCircle } from 'lucide-react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({ year, month, challengeData, onSelectDay, onCompleteAllMonth }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth() + 1;
  const todayDate = new Date().getDate();

  // Create empty slots before 1st day of month
  const emptySlots = Array.from({ length: firstDayOfWeek });
  
  // Create days 1..daysInMonth
  const dayList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Calendar Header Title & Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} style={{ color: 'var(--naver-green)' }} />
            <span>{month}월 1일 3포 달성 시각 캘린더</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
            날짜를 클릭하면 1일 3포 각각의 글 제목, 캡처 썸네일, 링크를 상세 기록할 수 있습니다.
          </p>
        </div>

        {/* Header Actions & Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Batch Complete All Month Button */}
          <button onClick={onCompleteAllMonth} className="btn btn-gold" style={{ padding: '7px 14px', fontSize: '0.85rem' }} title={`${month}월의 모든 날짜를 1일 3포 완주로 즉시 등록`}>
            <Sparkles size={15} /> {month}월 일괄 3포 완주
          </button>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.25)', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6E7681' }}></span>
              <span>0/3 미작성</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CD7F32' }}></span>
              <span>1/3 (1포)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C0C0C0' }}></span>
              <span>2/3 (2포)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFB800' }}></span>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>3/3 완주 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekday Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gap: '10px',
        textAlign: 'center',
        marginBottom: '10px',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: 'var(--text-sub)'
      }}>
        {WEEKDAYS.map((day, idx) => (
          <div key={day} style={{ color: idx === 0 ? '#FF5722' : idx === 6 ? '#2196F3' : 'inherit', padding: '6px' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gap: '10px'
      }}>
        {/* Blank Padding Days */}
        {emptySlots.map((_, idx) => (
          <div key={`empty-${idx}`} style={{
            minHeight: '115px',
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 'var(--radius-md)',
            opacity: 0.2
          }} />
        ))}

        {/* Actual Month Days */}
        {dayList.map(dayNum => {
          const formattedDay = String(dayNum).padStart(2, '0');
          const formattedMonth = String(month).padStart(2, '0');
          const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

          const dayData = challengeData[dateKey];
          const posts = dayData?.posts || [
            { id: 1, completed: false },
            { id: 2, completed: false },
            { id: 3, completed: false }
          ];

          const completedCount = posts.filter(p => p.completed).length;
          const isToday = (year === todayYear && month === todayMonth && dayNum === todayDate);

          // Card Background & Border according to completed count
          let bgStyle = 'rgba(255, 255, 255, 0.03)';
          let borderStyle = '1px solid var(--border-color)';
          let glowClass = '';

          if (completedCount === 3) {
            bgStyle = 'linear-gradient(145deg, rgba(3, 199, 90, 0.15) 0%, rgba(255, 184, 0, 0.12) 100%)';
            borderStyle = '2px solid rgba(3, 199, 90, 0.6)';
            glowClass = 'animate-pulse-glow';
          } else if (completedCount === 2) {
            bgStyle = 'rgba(192, 192, 192, 0.08)';
            borderStyle = '1px solid rgba(192, 192, 192, 0.3)';
          } else if (completedCount === 1) {
            bgStyle = 'rgba(205, 127, 50, 0.08)';
            borderStyle = '1px solid rgba(205, 127, 50, 0.3)';
          }

          if (isToday) {
            borderStyle = '2px solid var(--gold-primary)';
          }

          return (
            <div
              key={dateKey}
              onClick={() => onSelectDay(dateKey)}
              className={glowClass}
              style={{
                minHeight: '115px',
                minWidth: 0,
                overflow: 'hidden',
                background: bgStyle,
                border: borderStyle,
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Day Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: isToday ? 'var(--gold-primary)' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {dayNum}
                  {isToday && (
                    <span style={{ fontSize: '0.65rem', padding: '1px 5px', background: 'var(--gold-primary)', color: '#000', borderRadius: '4px', fontWeight: 900 }}>
                      오늘
                    </span>
                  )}
                </span>

                {/* Status Badge Tag */}
                {completedCount === 3 ? (
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    <Flame size={10} className="animate-flame" /> 3포 완주!
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                    {completedCount}/3포
                  </span>
                )}
              </div>

              {/* 1일 3포 Visual Icons Row */}
              <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                {posts.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    style={{
                      flex: 1,
                      height: '24px',
                      borderRadius: '6px',
                      background: p.completed 
                        ? (idx === 2 ? 'var(--gold-gradient)' : 'linear-gradient(135deg, var(--naver-green) 0%, var(--naver-green-dark) 100%)')
                        : 'rgba(255,255,255,0.06)',
                      border: p.completed ? 'none' : '1px dashed rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: p.completed ? '#000' : 'rgba(255,255,255,0.3)',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}
                    title={p.title ? `포스트 ${idx+1}: ${p.title}` : `포스트 ${idx+1}`}
                  >
                    {p.completed ? (idx === 2 ? '🔥' : '✓') : (idx + 1)}
                  </div>
                ))}
              </div>

              {/* Mini Post Titles Snippet */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {posts.find(p => p.completed && p.title)?.title || (
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <PlusCircle size={10} /> 기록 입력하기
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
