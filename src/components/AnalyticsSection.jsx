import React from 'react';
import { BarChart3, PieChart, Sparkles, Target, Flame, Lightbulb, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';

const MOTIVATIONAL_QUOTES = [
  "꾸준한 1일 3포가 내 블로그를 스마트에디터 상위 노출로 이끕니다! 🔥",
  "오늘 작성한 3개의 포스팅이 내일의 검색 유입과 자산을 만듭니다.",
  "1일 3포 챌린지! 포기하지 않고 달리는 당신이 진정한 슈퍼 블로거입니다 🏆",
  "작은 습관이 모여 커다란 결과를 만듭니다. 오늘도 3포 완주 가자!",
  "블로그 성장의 비결은 매일 멈추지 않고 달리는 1일 3포 마라톤에 있습니다."
];

export default function AnalyticsSection({ challengeData, year, month, stats }) {
  const formattedMonth = String(month).padStart(2, '0');
  const monthPrefix = `${year}-${formattedMonth}`;

  // Count category distribution
  const categoryCounts = {};
  CATEGORIES.forEach(c => categoryCounts[c.label] = 0);

  Object.keys(challengeData)
    .filter(key => key.startsWith(monthPrefix))
    .forEach(key => {
      const day = challengeData[key];
      if (day && day.posts) {
        day.posts.forEach(p => {
          if (p.completed && p.category) {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
          }
        });
      }
    });

  const totalCatPosts = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  // Pick random quote based on day
  const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* Category Breakdown Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PieChart size={18} style={{ color: 'var(--naver-green)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>카테고리별 포스팅 분포</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.label] || 0;
            const pct = totalCatPosts > 0 ? Math.round((count / totalCatPosts) * 100) : 0;

            return (
              <div key={cat.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ color: 'var(--text-sub)' }}>{count}개 ({pct}%)</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Quote & Blogging Tips */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>오늘의 1일 3포 동기부여</h3>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255,184,0,0.1) 0%, rgba(3,199,90,0.1) 100%)',
            border: '1px solid rgba(255,184,0,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6 }}>
              "{quote}"
            </p>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--naver-green-light)' }} />
              <span>포스팅 시 대표 썸네일과 키워드를 꼼꼼히 기록해보세요.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--naver-green-light)' }} />
              <span>'블로그 인증샷 생성' 기능으로 이웃들에게 성과를 공유해보세요!</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
