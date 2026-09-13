import React from 'react';
import { ShieldCheck, Info, Mail, Heart, Sparkles, HelpCircle } from 'lucide-react';
import AdContainer from './AdContainer';

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenWelcome, currentYear }) {
  return (
    <footer style={{
      marginTop: '60px',
      paddingTop: '32px',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-sub)',
      fontSize: '0.88rem'
    }}>
      
      {/* Bottom Ad Placement Container */}
      <AdContainer label="스폰서 파트너" slot="footer-bottom" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/mascot.png" alt="Mascot" style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.98rem' }}>
              po3.site <span style={{ color: 'var(--naver-green)' }}>1일 3포</span> 챌린지 캘린더
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              네이버 블로그 1일 3포스팅 매일 완주 및 C-Rank 상승을 위한 전용 러너 트래커
            </p>
          </div>
        </div>

        {/* Right Policy Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenWelcome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <HelpCircle size={16} style={{ color: 'var(--naver-green-light)' }} />
            이용 안내 가이드 🚀
          </button>

          <button
            onClick={onOpenPrivacy}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--naver-green)' }} />
            개인정보처리방침 (Privacy Policy)
          </button>

          <button
            onClick={onOpenTerms}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <Info size={16} style={{ color: 'var(--accent-gold)' }} />
            이용약관 및 소개
          </button>

          <a
            href="mailto:moonnb@gmail.com"
            style={{
              color: 'var(--text-sub)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Mail size={16} />
            제휴/문의
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
        <p>
          &copy; {currentYear} po3.site • All rights reserved. 본 서비스는 네이버 공식 서비스가 아닌 독립적인 블로그 챌린지 웹 앱입니다.
        </p>
      </div>

    </footer>
  );
}
