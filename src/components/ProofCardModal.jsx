import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Sparkles, X, Flame, Trophy, CheckCircle2 } from 'lucide-react';

export default function ProofCardModal({ stats, year, month, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const todayStr = `${year}년 ${month}월 ${new Date().getDate()}일`;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High DPI resolution
        backgroundColor: '#0D1117',
        useCORS: true
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `네이버블로그_1일3포_챌린지_인증카드_${year}${month}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to generate proof image:", e);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '650px', padding: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-gold">네이버 블로그 포스팅 첨부용</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>
              1일 3포 챌린지 <span style={{ color: 'var(--naver-green)' }}>인증카드 생성기</span>
            </h2>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Printable Card Area (Target for html2canvas) */}
        <div 
          ref={cardRef}
          style={{
            background: 'linear-gradient(135deg, #0B0F19 0%, #161B22 100%)',
            border: '2px solid rgba(3, 199, 90, 0.5)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 0 35px rgba(3, 199, 90, 0.25)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '20px'
          }}
        >
          {/* Decorative Background Accents */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(3,199,90,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Header Inside Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid #03C75A', overflow: 'hidden', background: '#000' }}>
                <img src="/mascot.png" alt="Mascot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#03C75A', fontWeight: 700 }}>NAVER BLOG WRITING CHALLENGE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>월간 1일 3포 완주 인증서</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#8B949E' }}>발행 기준일</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFB800' }}>{todayStr}</div>
            </div>
          </div>

          {/* Stats Summary Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#8B949E' }}>현재 달성률</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#03C75A' }}>{stats.progressPercent}%</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#8B949E' }}>누적 작성글</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFB800' }}>{stats.totalPostsCompleted}개</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#8B949E' }}>연속 달성</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FF5722' }}>🔥 {stats.streak}일</div>
            </div>
          </div>

          {/* Progress Bar inside Card */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 700 }}>
              <span>{month}월 챌린지 진행도</span>
              <span>{stats.totalPostsCompleted} / {stats.totalPostsGoal} 포스팅</span>
            </div>
            <div style={{ height: '14px', borderRadius: '7px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${stats.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #03C75A 0%, #FFB800 100%)', borderRadius: '7px' }} />
            </div>
          </div>

          {/* Footer inside Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '16px', fontSize: '0.78rem', color: '#8B949E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#03C75A" />
              <span>검증 완료: 네이버 블로그 1일 3포 챌린지 대시보드</span>
            </div>
            <div>Official Certification</div>
          </div>

        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            닫기
          </button>
          <button 
            onClick={handleDownloadImage} 
            disabled={downloading}
            className="btn btn-naver"
            style={{ padding: '10px 24px' }}
          >
            <Download size={16} />
            <span>{downloading ? '이미지 생성 중...' : '인증샷 PNG 다운로드'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
