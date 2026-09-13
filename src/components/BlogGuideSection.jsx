import React, { useState } from 'react';
import { BookOpen, Clock, Target, Lightbulb, Sparkles, HelpCircle, ChevronDown, ChevronUp, CheckCircle, ShieldCheck } from 'lucide-react';
import AdContainer from './AdContainer';

export default function BlogGuideSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      id: 1,
      tag: '골든타임 전략',
      icon: Clock,
      title: '네이버 블로그 1일 3포 성공하는 3가지 골든타임 시간대',
      summary: '블로그 이웃과 방문자가 가장 활발하게 활동하는 시간대에 3개의 글을 배치하여 조회수를 극대화하는 노하우를 소개합니다.',
      content: `
### 1. 오전 08:00 ~ 09:00 (출근길 및 아침 루틴)
직장인 및 학생들의 출근/등교 시간대는 모바일 블로그 방문량이 급증하는 첫 번째 피크 타임입니다. 
- **추천 주제**: 정보성 아티클, 일상 다짐, 아침 뉴스 요약, 건강/생활 꿀팁
- **전략**: 전날 밤 예약 발행을 설정해 두면 아침 8시에 맞춰 자동으로 이웃 소식 최상단에 노출됩니다.

### 2. 오후 12:30 ~ 13:30 (점심시간 힐링타임)
점심 식사 후 여유 시간에 스마트폰으로 짧은 콘텐츠를 소비하는 시간대입니다.
- **추천 주제**: 맛집 리뷰, 카페 후기, IT/가전 개봉기, 제품 리뷰
- **전략**: 썸네일과 제목에 직관적인 키워드를 넣어 클릭률(CTR)을 높이세요.

### 3. 밤 21:00 ~ 23:00 (취침 전 황금시간대)
네이버 전체 블로그 사용량이 가장 높은 최대 피크 시간대입니다.
- **추천 주제**: 심층 정보글, 전문 지식, 재테크/투자 분석, 자기계발/공부 기록
- **전략**: 체류 시간을 길게 유도할 수 있는 풍부한 사진과 가독성 좋은 본문 배치가 핵심입니다.
      `
    },
    {
      id: 2,
      tag: '검색 알고리즘',
      icon: Target,
      title: '네이버 검색 알고리즘 (C-Rank & DIA+) 최신 반영 가이드',
      summary: '네이버 상위 노출을 결정하는 C-Rank(블로그 전문성)와 DIA+(문서 자체의 유익성) 알고리즘을 이해하고 글을 쓰는 방법입니다.',
      content: `
### C-Rank (Creator Rank) 핵심 요약
C-Rank는 특정 주제에 대한 블로그의 전문성과 인지도, 꾸준함을 평가합니다.
1. **주제 일관성**: 상위 주제(예: IT/가전, 일상, 맛집, 여행 등) 카테고리를 명확히 정하고 꾸준히 포스팅하세요.
2. **꾸준한 활동**: 1일 3포 챌린지처럼 매일 연속해서 글을 쌓아 올리는 것이 C-Rank 신뢰도 상승의 지름길입니다.

### DIA+ (Document Intent Analysis) 핵심 요약
DIA+는 개별 게시글이 방문자에게 얼마나 유용한 정보를 주는지 실시간으로 측정합니다.
1. **체류 시간**: 체류 시간이 길수록 좋은 글입니다. (최소 2~3분 이상 읽도록 가독성 있게 작성)
2. **독창적 경험**: 직접 촬영한 고화질 사진과 본인만의 경험담/느낀 점을 포함하세요.
3. **가독성 높이기**: 굵은 글씨, 하이라이트, 구분선, 표 등을 적극 활용해 유저가 쉽게 읽을 수 있도록 편집하세요.
      `
    },
    {
      id: 3,
      tag: '소재 발굴 팁',
      icon: Lightbulb,
      title: '1일 3포 글감이 고갈되었을 때 즉시 활용 가능한 10가지 주제',
      summary: '매일 3개의 글을 쓸 때 주제 선정에 어려움을 겪는 블로거들을 위한 무한 소재 생성 포맷입니다.',
      content: `
매일 3포스팅을 지속하다 보면 '무슨 글을 써야 하지?'라는 소재 고갈에 부딪히기 쉽습니다. 아래 10가지 포맷을 순환하며 활용해 보세요:

1. **오늘 사용한 앱/웹 서비스 리뷰**: 매일 쓰는 앱의 숨은 꿀팁이나 사용 후기 작성
2. **자주 묻는 질문(FAQ) 정리**: 본인 분야에서 사람들이 궁금해하는 질문에 답하는 글
3. **오늘의 소비 내역(내돈내산)**: 편의점 신상, 배달 음식, 소소한 구매품 리뷰
4. **뉴스/이슈 견해 정리**: 최신 산업 뉴스나 이슈를 요약하고 나만의 생각 남기기
5. **독서/강의 요약 노트**: 책 한 구절이나 유튜브 유익한 영상 요약 및 소감
6. **내 일상의 실패 & 성공 경험담**: 어떤 문제를 해결한 경험이나 착오 과정 공유
7. **비교 분석 콘텐츠**: A 제품 vs B 제품, A 장소 vs B 장소 장단점 비교
8. **단골 맛집/카페 재방문기**: 위치, 주차, 메뉴 꿀팁을 포함한 상세 정보
9. **월간/주간 목표 체크리스트**: 1일 3포 챌린지 달성 현황 및 회고 글
10. **초보자를 위한 가이드북**: '처음 시작하는 사람을 위한 A to Z Step 1' 글 쓰기
      `
    }
  ];

  const faqs = [
    {
      q: 'Q. 1일 3포스팅을 하면 블로그가 저품질(검색 누락)에 걸리지 않나요?',
      a: '아닙니다! 네이버의 검색 시스템은 동일한 글을 복사해 붙여넣거나(복사글), 동일 키워드로 기계적 도배를 하지 않는 한, 정상적이고 유익한 1일 3포스팅은 C-Rank 지수를 폭발적으로 성장시키는 계기가 됩니다. 글 사이의 시간 간격(최소 2~3시간 이상)을 두고 고유한 콘텐츠를 발행하면 매우 안전합니다.'
    },
    {
      q: 'Q. 하루에 포스팅 3개를 올릴 시간이 부족할 땐 어떻게 하나요?',
      a: '네이버 블로그의 [예약 발행] 기능과 [임시 저장] 기능을 적극 활용하세요! 주말이나 여유 시간이 생겼을 때 3~6개의 글을 미리 작성하여 예약 등록해 두면 바쁜 평일에도 1일 3포 스트릭을 끊기지 않고 계속 유지할 수 있습니다.'
    },
    {
      q: 'Q. 네이버 애드포스트 승인 조건은 어떻게 되나요?',
      a: '네이버 애드포스트는 보통 (1) 블로그 개설 90일 이상, (2) 최근 30일 포스팅 50개 이상, (3) 일평균 방문자수 100명 이상일 때 신청하면 쉽게 승인됩니다. 1일 3포 챌린지를 한 달만 유지하셔도 90개의 포스팅이 쌓여 애드포스트 승인 조건이 순식간에 달성됩니다!'
    },
    {
      q: 'Q. 이 캘린더 사이트(po3.site)의 개인정보 보안은 안전한가요?',
      a: '네! 본 웹 앱은 어떠한 회원가입도 요구하지 않으며, 사용자가 입력한 포스팅 기록과 사진은 외부 서버에 저장되지 않고 100% 본인 기기 브라우저(localStorage)에만 안전하게 보관됩니다. 또한 Cloudflare SSL 암호화 통신으로 완벽히 보호됩니다.'
    }
  ];

  return (
    <div style={{ marginTop: '40px' }}>
      
      {/* Ad Placement Container - Top of Guide */}
      <AdContainer label="스폰서 정보" slot="guide-top" />

      {/* Guide Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(3,199,90,0.12) 0%, rgba(0,208,255,0.08) 100%)', border: '1px solid rgba(3,199,90,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span className="badge badge-green">
            <BookOpen size={14} /> 블로거 필독 성공 가이드
          </span>
          <span className="badge badge-gold">
            <Sparkles size={14} /> 1일 3포 노하우
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          네이버 블로그 <span style={{ color: 'var(--naver-green)' }}>1일 3포 완주</span> & 검색 상위노출 가이드
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '800px' }}>
          꾸준한 1일 3포스팅은 네이버 C-Rank 신뢰도를 단기간에 올리는 가장 확실한 전략입니다. 아래 체계적인 골든타임 분석과 알고리즘 노하우를 바탕으로 챌린지를 성공으로 이끌어보세요.
        </p>
      </div>

      {/* 3 Major Guides Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {guides.map((g) => {
          const IconComp = g.icon;
          return (
            <div key={g.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.78rem' }}>{g.tag}</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(3,199,90,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--naver-green)' }}>
                    <IconComp size={20} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px', lineHeight: '1.4' }}>
                  {g.title}
                </h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {g.summary}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {g.content.trim()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ad Placement Container - Middle */}
      <AdContainer label="추천 정보" slot="guide-mid" />

      {/* FAQ Section */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <HelpCircle size={22} style={{ color: 'var(--naver-green)' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>자주 묻는 질문 (FAQ)</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openFaq === idx && (
                <div style={{ padding: '0 20px 18px 20px', color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: '1.6', borderTop: '1px dashed var(--border-color)', paddingTop: '14px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
