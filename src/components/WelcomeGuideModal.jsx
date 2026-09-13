import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap, Rocket, X, CheckCircle2, Flame, AlertCircle } from 'lucide-react';

export default function WelcomeGuideModal({ onClose }) {
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
          maxWidth: '620px',
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
            transition: 'all 0.2s'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
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
              <span className="badge badge-gold">1일 3포 완주 가이드</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '4px' }}>
              네이버 블로그 <span style={{ color: 'var(--naver-green)' }}>1일 3포 챌린지</span> 이용 안내
            </h2>
          </div>
        </div>

        {/* 4 Core Features & User Tips */}
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

        {/* Footer Checkbox & Confirm Button */}
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

          <button
            onClick={handleConfirm}
            className="btn btn-naver"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <Rocket size={18} />
            <span>확인하고 바로 시작하기!</span>
          </button>
        </div>

      </div>
    </div>
  );
}
