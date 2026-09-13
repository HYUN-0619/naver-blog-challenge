import React from 'react';
import { X, ShieldCheck, Lock, Eye, Database, FileText } from 'lucide-react';

export default function PrivacyModal({ onClose }) {
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
          <ShieldCheck size={26} style={{ color: 'var(--naver-green)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>개인정보처리방침 (Privacy Policy)</h2>
        </div>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          최종 수정일: 2026년 9월 13일
        </p>

        <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--naver-green)', marginBottom: '6px' }}>
              1. 데이터 수집 및 보관 방침 (서버 전송 0%)
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              '네이버 블로그 1일 3포 챌린지 캘린더' 서비스는 이용자의 어떠한 개인정보(이름, 이메일, 전화번호 등)도 회원가입 또는 서버로 수집/저장하지 않습니다.
              사용자가 작성한 일별 블로그 포스팅 데이터, 썸네일, 링크 및 달성 현황은 **100% 사용자의 개인 브라우저 내부(localStorage)**에만 보관되며 외부 서버로 전송되지 않습니다.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--naver-green)', marginBottom: '6px' }}>
              2. 쿠키(Cookie) 및 제3자 광고 (Google AdSense) 관련 안내
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              본 웹사이트는 무료 서비스 제공 및 사이트 운영 유지를 위해 구글 애드센스(Google AdSense) 등 제3자 광고 네트워크를 사용할 수 있습니다.
            </p>
            <ul style={{ color: 'var(--text-sub)', paddingLeft: '20px', marginTop: '6px' }}>
              <li>구글을 포함한 제3자 판매자는 쿠키를 사용하여 사용자의 이전 방문 기록을 바탕으로 광고를 제공합니다.</li>
              <li>구글의 광고 쿠키 사용으로 구글 및 파트너사는 웹사이트 방문 기록에 기반한 맞춤형 광고를 제공할 수 있습니다.</li>
              <li>이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: 'var(--naver-green)' }}>구글 광고 설정</a>을 방문하여 맞춤형 광고 수신을 거부할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--naver-green)', marginBottom: '6px' }}>
              3. 개인정보 데이터 파기 방법
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              이용자는 웹사이트 상단의 **[전체 초기화]** 버튼을 눌러 언제든지 본인의 기기에 저장된 모든 챌린지 데이터를 즉시 완전 파기할 수 있습니다. 브라우저의 인터넷 사용 기록(캐시 및 로컬 스토리지)을 삭제하셔도 데이터가 파기됩니다.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--naver-green)', marginBottom: '6px' }}>
              4. 문의사항 및 의견 제출
            </h3>
            <p style={{ color: 'var(--text-sub)' }}>
              개인정보 보호 관련 문의나 서비스 개선에 대한 의견은 공식 사이트 메일(<span style={{ color: 'var(--naver-green)' }}>moonnb@gmail.com</span>)로 전달해 주시기 바랍니다.
            </p>
          </section>

        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={onClose} className="btn btn-naver" style={{ padding: '10px 24px' }}>
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
}
