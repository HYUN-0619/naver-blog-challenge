import React from 'react';
import { X, FileText, Info, CheckCircle2 } from 'lucide-react';

export default function TermsModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
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
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Info size={26} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>서비스 소개 및 이용약관 (About & Terms)</h2>
        </div>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          네이버 블로그 1일 3포 챌린지 캘린더
        </p>

        <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px' }}>
              1. 서비스 목적 및 가치
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              본 서비스는 네이버 블로그를 운영하는 창작자들이 매일 3개의 포스팅 목표를 달성하도록 시각적 달리기 동기부여 트랙, 월간 캘린더, 스트릭 계측기 및 명예의 전당 갤러리를 제공하는 웹 서비스입니다.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px' }}>
              2. 서비스 이용 조건
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              본 서비스는 누구나 무료로 자유롭게 이용할 수 있습니다. 캘린더 기록 및 인증샷 카드 생성 기능은 사용자의 저작권을 존중하며 자유로운 블로그 공유를 권장합니다.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px' }}>
              3. 책임의 한계
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              본 서비스는 블로그 기록 관리 도구이며, 네이버(Naver Corporation) 공식 서비스가 아닙니다. 사용자가 기기 내부 브라우저 저장소를 초기화할 경우 데이터가 소실될 수 있으므로 중요 기록은 미리 '인증샷 카드 생성'을 이용해 이미지로 저장해 두시는 것을 권장합니다.
            </p>
          </section>

        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={onClose} className="btn btn-gold" style={{ padding: '10px 24px' }}>
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
}
