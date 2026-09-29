import React from 'react';
import { ShieldCheck, Info, Mail, Heart, Sparkles, HelpCircle } from 'lucide-react';

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenWelcome, onOpenAdmin, currentYear }) {
  return (
    <footer style={{
      marginTop: '60px',
      paddingTop: '32px',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-sub)',
      fontSize: '0.88rem'
    }}>
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
              네이버 블로그 <span style={{ color: 'var(--naver-green)' }}>1일 3포</span> 챌린지 캘린더
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              네이버 블로그 1일 3포스팅 매일 완주 및 C-Rank 상승을 위한 전용 러너 트래커
            </p>
          </div>
        </div>

        {/* Right Policy Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="/about"
            style={{
              color: 'var(--text-main)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <HelpCircle size={16} style={{ color: 'var(--naver-green-light)' }} />
            서비스 소개
          </a>

          <a
            href="/privacy"
            style={{
              color: 'var(--text-main)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--naver-green)' }} />
            개인정보처리방침
          </a>

          <a
            href="/terms"
            style={{
              color: 'var(--text-main)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <Info size={16} style={{ color: 'var(--accent-gold)' }} />
            이용약관
          </a>

          <a
            href="mailto:admin@po3.site"
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

      {/* Guide Links Directory for SEO & Crawlers */}
      <div style={{
        margin: '16px 0 20px',
        padding: '16px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '0.82rem'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} style={{ color: 'var(--naver-green)' }} />
          네이버 블로그 1일 3포 전문 가이드 컬렉션
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px' }}>
          <a href="/guide/c-rank-dia-algorithm" style={{ color: 'var(--text-sub)' }}>• C-Rank & D.I.A 알고리즘 완벽 분석</a>
          <a href="/guide/blog-golden-time" style={{ color: 'var(--text-sub)' }}>• 1일 3포 골든타임 시간표 공략</a>
          <a href="/guide/adpost-approval-guide" style={{ color: 'var(--text-sub)' }}>• 애드포스트 30일 첫 승인 가이드</a>
          <a href="/guide/keyword-seo-strategy" style={{ color: 'var(--text-sub)' }}>• 스마트블록 상위노출 키워드 전략</a>
          <a href="/guide/blog-topic-ideas" style={{ color: 'var(--text-sub)' }}>• 글감 고민 끝내는 1일 3포 주제 30선</a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
        <p>
          &copy; {currentYear} 네이버 블로그 1일 3포 챌린지 캘린더 • All rights reserved. 본 서비스는 네이버 공식 서비스가 아닌 독립적인 블로그 챌린지 웹 앱입니다.
          {' '}
          <button
            onClick={onOpenAdmin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              opacity: 0.6,
              marginLeft: '8px',
              textDecoration: 'underline'
            }}
            title="운영자 전용 관리 콘솔"
          >
            🔒 관리자
          </button>
        </p>
      </div>

    </footer>
  );
}
