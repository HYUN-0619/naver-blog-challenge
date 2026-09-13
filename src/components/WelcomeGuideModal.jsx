import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Rocket, X, Flame, AlertCircle, ChevronRight, ChevronLeft, Calendar, Trophy, Image as ImageIcon, HelpCircle } from 'lucide-react';

export default function WelcomeGuideModal({ onClose }) {
  const [page, setPage] = useState(1);
  const [dontShowToday, setDontShowToday] = useState(false);

  const handleConfirm = () => {
    if (dontShowToday) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('po3_hide_welcome_date', todayStr);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel animate-fade-in" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          border: '1px solid var(--naver-green-glow)',
          boxShadow: '0 0 40px rgba(3, 199, 90, 0.25)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleConfirm}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header & Page Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(3,199,90,0.2) 0%, rgba(255,184,0,0.2) 100%)',
              border: '1px solid var(--naver-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src="/mascot.png" alt="Mascot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-green">환영합니다! 👋</span>
                <span className="badge badge-gold">페이지 {page} / 3</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>
                {page === 1 && <>네이버 블로그 <span style={{ color: 'var(--naver-green)' }}>1일 3포 챌린지</span> 안심 가이드</>}
                {page === 2 && <>1일 3포 대시보드 <span style={{ color: 'var(--gold-primary)' }}>상세 사용방법 가이드</span></>}
                {page === 3 && <>자주 묻는 질문 <span style={{ color: '#00D0FF' }}>(FAQ & 도움말)</span></>}
              </h2>
            </div>
          </div>

          {/* 3 Page Switcher Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setPage(1)}
              style={{
                padding: '5px 10px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: page === 1 ? 'var(--naver-green)' : 'transparent',
                color: page === 1 ? '#000' : 'var(--text-sub)',
                fontWeight: 700
              }}
            >
              1. 안내 팁
            </button>
            <button
              onClick={() => setPage(2)}
              style={{
                padding: '5px 10px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: page === 2 ? 'var(--gold-primary)' : 'transparent',
                color: page === 2 ? '#000' : 'var(--text-sub)',
                fontWeight: 700
              }}
            >
              2. 사용방법
            </button>
            <button
              onClick={() => setPage(3)}
              style={{
                padding: '5px 10px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: page === 3 ? '#00D0FF' : 'transparent',
                color: page === 3 ? '#000' : 'var(--text-sub)',
                fontWeight: 700
              }}
            >
              3. FAQ
            </button>
          </div>
        </div>

        {/* PAGE 1: 4 Core Features & Safety Tips */}
        {page === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            
            {/* Tip 1 */}
            <div style={{
              background: 'rgba(3, 199, 90, 0.08)',
              border: '1px solid rgba(3, 199, 90, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <ShieldCheck size={22} style={{ color: 'var(--naver-green-light)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  1. 회원가입 0% • 100% 개별 안전 저장
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                  어떠한 개인정보나 로그인도 요구하지 않습니다. 작성하신 기록은 오직 <strong>본인의 기기(브라우저)에만 독립 보관</strong>되어 외부 유출 위험이 0%입니다.
                </p>
              </div>
            </div>

            {/* Tip 2 */}
            <div style={{
              background: 'rgba(255, 184, 0, 0.08)',
              border: '1px solid rgba(255, 184, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Flame size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  2. 러너 캐릭터와 함께 달리는 동기부여
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                  포스팅을 작성할 때마다 내 블로거 캐릭터가 한 달 피니시 라인을 향해 전속력으로 달려갑니다! 마일스톤 보상과 연속 달성 스트릭을 이어가 보세요.
                </p>
              </div>
            </div>

            {/* Tip 3 */}
            <div style={{
              background: 'rgba(0, 208, 255, 0.08)',
              border: '1px solid rgba(0, 208, 255, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Sparkles size={22} style={{ color: '#00D0FF', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  3. 인증샷 PNG 백업 & 블로그 이웃 공유
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                  상단 <strong>[블로그 인증샷 생성]</strong> 버튼을 누르면 나의 1일 3포 달성 기록이 담긴 고화질 PNG 이미지 인증카드가 생성됩니다. 챌린지 성과를 블로그에 자랑해보세요!
                </p>
              </div>
            </div>

            {/* Tip 4 */}
            <div style={{
              background: 'rgba(255, 45, 85, 0.08)',
              border: '1px solid rgba(255, 45, 85, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={22} style={{ color: '#FF2D55', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  4. 데이터 보관 안내 (인터넷 사용 기록 삭제 주의)
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                  브라우저의 '사용 기록/캐시 삭제'를 실행하면 기기에 저장된 기록이 지워질 수 있으니, 매월 완주 후에는 꼭 <strong>인증샷을 이미지 파일로 백업</strong>해 두시는 것을 권장합니다.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* PAGE 2: Step-by-Step Detailed User Manual Guide */}
        {page === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
            
            {/* Step 1 */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Calendar size={18} style={{ color: 'var(--naver-green)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--naver-green-light)' }}>
                  STEP 1. 캘린더 날짜 클릭 & 1일 3포 기록
                </h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
                <li>캘린더의 원하는 날짜를 클릭하면 <strong>1일 3포 기록 모달</strong>이 열립니다.</li>
                <li><strong>체크박스</strong>를 누르면 캘린더 날짜에 <strong>완주 도장</strong>이 찍힙니다.</li>
                <li>글 제목, URL, 5대 카테고리(일상, 정보, 리뷰, 수익형, 자유)를 기록합니다.</li>
                <li><strong>골든타임 피크 시각</strong>: 1포(07~09시), 2포(11:30~13:30시), 3포(20~23시)</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Trophy size={18} style={{ color: 'var(--gold-primary)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                  STEP 2. 실시간 달려가는 러너 그래픽 트랙
                </h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
                <li>포스팅을 채울 때마다 내 블로거 캐릭터가 피니시 라인으로 전속력 이동합니다.</li>
                <li>달성률(%)과 <strong>마일스톤 구간 보상</strong>(25% 🥉 ➔ 50% 🥈 ➔ 75% 🥇 ➔ 100% 완주 🏆)을 획득해 보세요.</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Flame size={18} style={{ color: '#FF7043' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF7043' }}>
                  STEP 3. 연속 달성(Streak) & 카테고리 분석
                </h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
                <li>하루 3포를 마친 날이 연속될수록 <strong>연속 달성 스트릭(Streak) 불꽃</strong>이 쌓입니다.</li>
                <li>카테고리 비율 분포 차트 및 매일 롤링되는 동기부여 명언으로 습관을 지키세요.</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ImageIcon size={18} style={{ color: '#00D0FF' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#00D0FF' }}>
                  STEP 4. 블로그 인증샷 카드 & 네이버 위젯 등록
                </h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
                <li>상단 <strong>[블로그 인증샷 생성]</strong>으로 고화질 성과 카드를 생성받으세요.</li>
                <li>네이버 블로그 레이아웃 설정에서 위젯 배너를 등록하면 바로가기가 연결됩니다.</li>
              </ul>
            </div>

          </div>
        )}

        {/* PAGE 3: Frequently Asked Questions (FAQ) */}
        {page === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            
            {/* FAQ 1 */}
            <div style={{ background: 'rgba(0,208,255,0.06)', border: '1px solid rgba(0,208,255,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00D0FF', marginBottom: '4px' }}>
                Q. 내 정보나 기록이 다른 사람에게 보이나요?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                <strong>절대 노출되지 않습니다.</strong> 회원가입이나 외부 서버 전송이 없으며, 오직 이용자 본인의 개인 브라우저에만 안전하게 보관됩니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div style={{ background: 'rgba(3,199,90,0.06)', border: '1px solid rgba(3,199,90,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--naver-green-light)', marginBottom: '4px' }}>
                Q. 입력을 실수했거나 해당 날짜만 지우고 싶어요.
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                캘린더에서 해당 날짜를 다시 클릭하면 글 제목이나 체크박스를 수정할 수 있으며, 모달 하단 <strong>[이 날의 기록 초기화]</strong>를 누르면 선택한 날만 깨끗이 삭제됩니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '4px' }}>
                Q. 다른 기기나 브라우저에서도 기록이 연동되나요?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                브라우저 기반 저장 방식이므로 다른 기기에서는 보이지 않으며, 브라우저 캐시 삭제 시 초기화될 수 있습니다. 매월 완주 후 <strong>[블로그 인증샷 생성]</strong>으로 이미지를 다운받아 백업해 두세요!
              </p>
            </div>

            {/* FAQ 4 */}
            <div style={{ background: 'rgba(255,87,34,0.06)', border: '1px solid rgba(255,87,34,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FF7043', marginBottom: '4px' }}>
                Q. 1년 12개월 전체 완주 기록은 어디서 확인하나요?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                상단 메인 메뉴의 <strong>[명예의 전당 갤러리]</strong> 탭을 클릭하면 1월부터 12월까지의 월별 완주 성과 트로피와 뱃지 현황을 한눈에 확인하실 수 있습니다.
              </p>
            </div>

            {/* FAQ 5 */}
            <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#A855F7', marginBottom: '4px' }}>
                Q. 내 네이버 블로그 사이드바에 이 주소를 위젯으로 달 수 있나요?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5', margin: 0 }}>
                네 가능합니다! 블로그 관리 ➔ 레이아웃·위젯 설정 ➔ [위젯직접등록]에서 <code>https://po3.site</code> 링크와 공식 위젯 배너 <code>https://po3.site/widget-banner.jpg</code>를 등록하시면 됩니다.
              </p>
            </div>

          </div>
        )}

        {/* Footer Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-sub)' }}>
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              style={{ accentColor: 'var(--naver-green)', width: '16px', height: '16px' }}
            />
            <span>오늘 하루 동안 다시 보지 않기</span>
          </label>

          <div style={{ display: 'flex', gap: '10px' }}>
            {page === 1 && (
              <button
                onClick={() => setPage(2)}
                className="btn btn-gold"
                style={{ padding: '10px 20px', fontSize: '0.92rem' }}
              >
                <span>상세 사용방법 보기</span>
                <ChevronRight size={18} />
              </button>
            )}

            {page === 2 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>이전</span>
                </button>
                <button
                  onClick={() => setPage(3)}
                  className="btn btn-blue"
                  style={{ padding: '10px 18px', fontSize: '0.92rem' }}
                >
                  <span>FAQ 질문보기</span>
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {page === 3 && (
              <>
                <button
                  onClick={() => setPage(2)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>이전</span>
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn btn-naver"
                  style={{ padding: '10px 22px', fontSize: '0.92rem' }}
                >
                  <Rocket size={18} />
                  <span>확인하고 시작하기!</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
