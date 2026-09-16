import React, { useState, useEffect } from 'react';
import { PieChart, Lightbulb, Sparkles, Flame, Trophy, Users, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { getVisitorStats, fetchAndRecordVisit } from '../utils/visitor';

const MOTIVATIONAL_QUOTES = [
  // 1 ~ 10
  "오늘 올린 3개의 포스팅이 내일의 검색 유입과 불로소득 자산이 됩니다! 💰",
  "꾸준함이 깡패다! 매일 쌓이는 1일 3포가 네이버 C-Rank 지수를 만듭니다. 🔥",
  "글 하나하나가 내 온라인 영토를 넓히는 최고의 지적 자산입니다. 🏰",
  "오늘 작성한 3포스팅이 한 달 뒤 90개의 든든한 검색 유입창이 됩니다.",
  "1일 3포 30일 완주! 애드포스트 수익과 방문자 수가 폭발하는 지름길입니다 🚀",
  "귀찮음을 이겨낸 포스팅 하나가 내 블로그의 일 방문자 수를 바꿉니다!",
  "완벽하게 쓰려 하지 말고, 일단 완료하세요! 완벽보다 중요한 건 완주입니다.",
  "글감이 없다고 포기하지 마세요. 소소한 나의 오늘이 누군가에겐 꿀정보가 됩니다 💡",
  "오늘 쓰기 싫은 마음을 이겨낸 3포가 당신을 슈퍼 블로거로 만듭니다. 🏆",
  "작은 습관이 모여 기적을 만듭니다. 오늘도 3포 완주 가자! 🔥",

  // 11 ~ 20
  "아침 1포, 점심 2포, 저녁 3포! 3대 골든타임 피크를 정복하세요 ⏰",
  "남들이 쉴 때 올리는 야간 3포가 상위 노출의 골든타임을 잡습니다 🌙",
  "네이버 알고리즘이 가장 사랑하는 블로거는 매일 멈추지 않고 달리는 러너입니다.",
  "꾸준한 3포스팅은 이웃 소식지 최상단을 점령하는 가장 확실한 전략입니다.",
  "달리가 힘들 땐 마일스톤 보상을 바라보세요. 피니시 라인이 눈앞입니다!",
  "매일 3포스팅을 작성하는 당신의 열정이 오늘 하루도 환하게 빛납니다. ✨",
  "포기하지 않고 달리는 당신의 매일매일이 이미 전설입니다.",
  "오늘의 3포 완주는 단순한 글쓰기가 아닌 내 꿈을 향한 레이스입니다 🏃",
  "오늘도 3포 완주 도장 쾅! 수고한 나 자신에게 박수를 보내주세요 👏",
  "꾸준히 달리는 사람을 이길 수는 없습니다. 오늘의 3포도 파이팅! 🔥",

  // 21 ~ 30
  "퇴근 후 졸린 눈을 비비며 쓴 3번째 포스팅이 월급 외 부수입을 만듭니다. 💼",
  "회사에서는 부속품일지라도, 내 블로그에서는 내가 1인 미디어의 대표입니다! 👑",
  "출근길 지하철 1포, 점심시간 2포, 침대 속 3포! 하루를 알차게 쓰는 갓생의 완성 🌟",
  "주말에 미리 쓴 예약 포스팅이 바쁜 평일의 든든한 구원투수가 됩니다 🛡️",
  "오늘 흘린 포스팅 땀방울이 다음 달 통장 잔고의 미소가 됩니다. 💵",
  "제목 키워드 하나, 대표 썸네일 하나가 검색 유입 10,000명의 기적을 만듭니다 🔍",
  "네이버 DIA+ 알고리즘은 솔직하고 정성스러운 내 경험담을 가장 좋아합니다.",
  "1일 3포로 90개의 포스팅이 쌓이면, 어떤 키워드든 상위 노출되는 마법이 일어납니다.",
  "이웃 추가 100명, 검색 유입 3배 증가! 이 모든 변화는 오늘 3포 완주부터 시작입니다.",
  "검색 누락 무서워 말고 유익한 3포로 C-Rank 지수를 폭발시키세요! 💥",

  // 31 ~ 40
  "오늘 안 쓰면 내일 6개 써야 합니다! 미루지 말고 지금 3포 깔끔하게 마감합시다 🔥",
  "슬럼프는 글을 쓸 때 극복됩니다. 멈추지 말고 일단 제목부터 타이핑하세요!",
  "다른 블로거들이 방심할 때 올리는 오늘의 3포가 역전의 발판이 됩니다 ⚡",
  "발행 버튼을 누르는 순간의 쾌감! 오늘 하루도 목표 달성의 희열을 느껴보세요.",
  "마라톤의 핵심은 페이스 조절입니다. 아침, 점심, 저녁 템포를 지켜 완주하세요!",
  "임시저장함에 자고 있는 글감들을 깨워주세요. 세상 밖으로 나갈 준비가 되었습니다 😴",
  "포스팅을 미루면 밀린 숙제가 되지만, 지금 작성하면 최고의 성취감이 됩니다!",
  "오늘 하루 고생한 나에게 선물하는 최고의 보상, 1일 3포 완주 뱃지 🎖️",
  "나의 소소한 경험이 누군가에겐 인생 꿀팁이 됩니다. 망설이지 말고 발행하세요!",
  "1일 3포 전설의 러너가 되는 길, 오늘 포스팅 3개로 완벽히 증명해보세요 🔥",

  // 41 ~ 50
  "블로그는 내 온라인 건물입니다. 1일 3포는 매일 한 층씩 올리는 자산 건축 작업입니다 🏗️",
  "글쓰기 근육도 운동과 같습니다. 매일 3포스팅으로 쓰다 보면 작성 속도가 2배로 빨라집니다 ⚡",
  "나라는 브랜드의 가치를 높이는 가장 확실한 방법, 매일 3개의 기록을 남기는 것입니다 ✍️",
  "오늘 올린 글이 네이버 메인판이나 검색 인기글에 떡상하는 날을 상상해 보세요 🌟",
  "1년 뒤 뒤돌아보았을 때 가장 잘했다고 생각할 결정, 바로 오늘 1일 3포 완주입니다.",
  "생각만 하지 말고 일단 키보드에 손을 얹으세요. 첫 문장이 써지면 3포 완주는 시작된 것입니다.",
  "아침의 1포가 하루의 자신감을 주고, 저녁의 3포가 오늘 하루를 완벽하게 완성합니다 🌙",
  "포스팅은 기분으로 쓰는 것이 아니라 시스템으로 쓰는 것입니다. 3포 루틴을 사수하세요!",
  "남들의 성공을 부러워만 하지 말고, 나의 3포로 나만의 성공 스토리를 직접 써내려가세요 📜",
  "달리기 멈추지 마세요! 당신의 1일 3포 챌린지는 수많은 블로거들에게 큰 영감이 되고 있습니다 🔥"
];

export default function AnalyticsSection({ challengeData, year, month, stats }) {
  const formattedMonth = String(month).padStart(2, '0');
  const monthPrefix = `${year}-${formattedMonth}`;

  const [visitorStats, setVisitorStats] = useState(() => getVisitorStats());

  useEffect(() => {
    let isMounted = true;
    fetchAndRecordVisit().then(stats => {
      if (isMounted && stats) {
        setVisitorStats(stats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Calculate 3 distinct daily rolling quote indices based on date
  const dayOfYear = new Date().getDate() + (new Date().getMonth() * 31);
  const baseIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
  
  const quote1 = MOTIVATIONAL_QUOTES[baseIndex];
  const quote2 = MOTIVATIONAL_QUOTES[(baseIndex + 17) % MOTIVATIONAL_QUOTES.length];
  const quote3 = MOTIVATIONAL_QUOTES[(baseIndex + 33) % MOTIVATIONAL_QUOTES.length];

  const dailyQuotes = [
    { id: 1, icon: Flame, color: '#FF7043', label: '🔥 동기부여 1', text: quote1 },
    { id: 2, icon: Sparkles, color: '#FFB800', label: '⚡ 습관 & 자산 2', text: quote2 },
    { id: 3, icon: Trophy, color: 'var(--naver-green)', label: '🏆 마인드셋 3', text: quote3 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* Card 1: Category Breakdown Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
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

        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-sub)', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
          총 {totalCatPosts}개 포스팅 완료 • 다양한 카테고리로 골고루 작성해 보세요!
        </div>
      </div>

      {/* Card 2: 3 Motivational Quotes Daily Rolling Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Lightbulb size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>오늘의 1일 3포 동기부여</h3>
          </div>

          {/* 3 Quotes List (No Boxes, Clean Text Only) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {dailyQuotes.map((q, idx) => {
              const IconComp = q.icon;
              return (
                <div
                  key={q.id}
                  style={{
                    borderBottom: idx < dailyQuotes.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                    paddingBottom: idx < dailyQuotes.length - 1 ? '12px' : '0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: q.color, fontWeight: 700, marginBottom: '4px' }}>
                    <IconComp size={14} />
                    <span>{q.label}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.1px' }}>
                    {q.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tips */}
        <div style={{ marginTop: '18px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
            💡 매일 동기부여 명언이 롤링 됩니다.
          </div>
        </div>

      </div>

      {/* Card 3: Live Daily & Cumulative Total Visitor Statistics Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: '#00D0FF' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>실시간 방문자 & 챌린저 통계</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', background: 'rgba(3,199,90,0.15)', color: 'var(--naver-green-light)', padding: '3px 8px', borderRadius: '10px', border: '1px solid rgba(3,199,90,0.3)', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--naver-green)', display: 'inline-block', boxShadow: '0 0 8px var(--naver-green)' }} />
              LIVE
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {/* Today Visitors */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0, 208, 255, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', fontWeight: 600, marginBottom: '4px' }}>
                ☀️ 오늘 방문자
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#00D0FF', fontFamily: "'Outfit', sans-serif" }}>
                {visitorStats.todayCount.toLocaleString()}<span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '2px', color: 'var(--text-muted)' }}>명</span>
              </div>
            </div>

            {/* Total Cumulative Visitors */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(3, 199, 90, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', fontWeight: 600, marginBottom: '4px' }}>
                🚀 누적 총 방문자
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--naver-green-light)', fontFamily: "'Outfit', sans-serif" }}>
                {visitorStats.totalCount.toLocaleString()}<span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '2px', color: 'var(--text-muted)' }}>명</span>
              </div>
            </div>
          </div>

          {/* Active Challengers Today Banner */}
          <div style={{ background: 'rgba(255, 184, 0, 0.08)', border: '1px solid rgba(255, 184, 0, 0.25)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                오늘 1일 3포 함께 달리는 러너
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                오늘도 수많은 블로거들이 완주 목표를 지키고 있습니다! 🔥
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div style={{ marginTop: '18px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
            📊 방문자 통계는 24시간 실시간 집계됩니다.
          </div>
        </div>

      </div>

    </div>
  );
}
