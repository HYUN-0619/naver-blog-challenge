import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Flame, Link as LinkIcon, Image as ImageIcon, Sparkles, Zap, Trash2, RotateCcw, Loader2, DownloadCloud } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { extractOgMetadata } from '../utils/ogExtractor';

export default function DayModal({ dateKey, dayData, onClose, onSave }) {
  const [loadingOg, setLoadingOg] = useState({});
  const [posts, setPosts] = useState(
    dayData?.posts ? JSON.parse(JSON.stringify(dayData.posts)) : [
      { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
      { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
      { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
    ]
  );

  const formattedDate = dateKey ? `${dateKey.split('-')[0]}년 ${dateKey.split('-')[1]}월 ${dateKey.split('-')[2]}일` : '';

  // Trigger celebration fireworks
  const triggerFireworks = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Auto-fetch OG Metadata (Title & Thumbnail) from Blog URL
  const handleFetchOg = async (idx, targetUrl) => {
    const urlToFetch = targetUrl || posts[idx]?.url;
    if (!urlToFetch || !urlToFetch.startsWith('http')) return;

    setLoadingOg(prev => ({ ...prev, [idx]: true }));
    const meta = await extractOgMetadata(urlToFetch);
    setLoadingOg(prev => ({ ...prev, [idx]: false }));

    const updated = [...posts];
    let changed = false;

    if (meta.image) {
      updated[idx].image = meta.image;
      changed = true;
    }
    if (meta.title && !updated[idx].title) {
      updated[idx].title = meta.title;
      changed = true;
    }
    if (changed || urlToFetch) {
      updated[idx].completed = true;
    }

    setPosts(updated);
  };

  // Toggle post completion
  const handleToggleCompleted = (idx) => {
    const updated = [...posts];
    updated[idx].completed = !updated[idx].completed;
    setPosts(updated);

    // If 3/3 reached, play confetti
    if (updated.filter(p => p.completed).length === 3) {
      triggerFireworks();
    }
  };

  // Update specific post field
  const handleFieldChange = (idx, field, value) => {
    const updated = [...posts];
    updated[idx][field] = value;
    // Auto complete if user types a title
    if (field === 'title' && value.trim().length > 0) {
      updated[idx].completed = true;
    }
    setPosts(updated);

    // Auto-fetch OG metadata if user pastes a valid http URL
    if (field === 'url' && value.startsWith('http') && value.length > 15) {
      handleFetchOg(idx, value);
    }
  };

  // Quick 1-click complete all 3 posts
  const handleCompleteAll = () => {
    const updated = posts.map((p, i) => ({
      ...p,
      completed: true,
      title: p.title || `포스팅 ${i+1} 발행 완료`
    }));
    setPosts(updated);
    triggerFireworks();
  };

  // Reset all 3 posts for this date instantly and sync to parent storage
  const handleResetDay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const reset = [
      { id: 1, completed: false, title: '', category: CATEGORIES[0].label, url: '', image: '', note: '' },
      { id: 2, completed: false, title: '', category: CATEGORIES[1].label, url: '', image: '', note: '' },
      { id: 3, completed: false, title: '', category: CATEGORIES[2].label, url: '', image: '', note: '' }
    ];
    setPosts(reset);
    onSave(dateKey, reset);
  };

  // Image Upload Handler (Convert file to base64 for local display & storage)
  const handleImageUpload = (idx, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(idx, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dateKey, posts);
    onClose();
  };

  const completedCount = posts.filter(p => p.completed).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid var(--naver-green-glow)' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-green">1일 3포 챌린지 일지</span>
              {completedCount === 3 && (
                <span className="badge badge-gold animate-flame">🔥 3포 완주 성공!</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
              {formattedDate} 기록
            </h2>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(3,199,90,0.12)', border: '1px solid rgba(3,199,90,0.3)', padding: '12px 18px', borderRadius: 'var(--radius-md)', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} style={{ color: 'var(--naver-green-light)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>오늘의 3포 완주 상태: <strong>{completedCount} / 3 개 완료</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={handleResetDay} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '0.85rem' }} title="이 날짜 기록 초기화">
              <RotateCcw size={14} /> 기록 초기화
            </button>
            <button type="button" onClick={handleCompleteAll} className="btn btn-gold" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              <Sparkles size={14} /> 3포 한 번에 완료하기
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 3 Posts Form Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {posts.map((post, idx) => (
              <div 
                key={post.id || idx}
                style={{
                  background: post.completed ? 'rgba(3, 199, 90, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                  border: post.completed ? '1px solid rgba(3, 199, 90, 0.4)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  transition: 'all 0.2s'
                }}
              >
                {/* Post Item Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(idx)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: post.completed ? 'none' : '2px solid var(--text-muted)',
                        background: post.completed ? (idx === 2 ? 'var(--gold-gradient)' : 'var(--naver-green)') : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#000',
                        fontWeight: 900
                      }}
                    >
                      {post.completed && (idx === 2 ? '🔥' : '✓')}
                    </button>

                    <span style={{ fontWeight: 800, fontSize: '1rem', color: post.completed ? 'var(--text-main)' : 'var(--text-sub)' }}>
                      포스팅 {idx + 1} {idx === 0 ? '(아침/1포)' : idx === 1 ? '(점심/2포)' : '(저녁/3포 완주!)'}
                    </span>

                    {/* Golden Time Target Badge */}
                    {idx === 0 && (
                      <span className="badge badge-green" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        🌅 추천 08:00 (출근 유입)
                      </span>
                    )}
                    {idx === 1 && (
                      <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        ☀️ 추천 12:30 (점심 유입)
                      </span>
                    )}
                    {idx === 2 && (
                      <span className="badge badge-fire" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        🌙 추천 21:00 (야간 피크)
                      </span>
                    )}
                  </div>

                  {/* Category Selector */}
                  <select
                    value={post.category || CATEGORIES[0].label}
                    onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.label} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Inputs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="글 제목 (예: 네이버 블로그 스마트에디터 활용법)"
                    value={post.title || ''}
                    onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                    className="form-input"
                    style={{ gridColumn: '1 / -1' }}
                  />

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="url"
                      placeholder="블로그 URL (https://blog.naver.com/...)"
                      value={post.url || ''}
                      onChange={(e) => handleFieldChange(idx, 'url', e.target.value)}
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleFetchOg(idx, post.url)}
                      disabled={loadingOg[idx] || !post.url}
                      className="btn btn-blue"
                      style={{ padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="URL에서 썸네일 & 제목 자동 가져오기"
                    >
                      {loadingOg[idx] ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      <span>{loadingOg[idx] ? '가져오는 중...' : '자동 썸네일'}</span>
                    </button>
                    {post.url && (
                      <a href={post.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '8px 12px' }} title="링크 열기">
                        <LinkIcon size={14} />
                      </a>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="메모 및 주요 키워드"
                    value={post.note || ''}
                    onChange={(e) => handleFieldChange(idx, 'note', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Thumbnail Image Attachment */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <ImageIcon size={14} />
                    <span>{post.image ? '캡처 썸네일 변경' : '캡처 썸네일 이미지 첨부'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(idx, e)}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {post.image && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={post.image} 
                        alt="Thumbnail" 
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--naver-green)' }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => handleFieldChange(idx, 'image', '')} 
                        style={{ background: 'none', border: 'none', color: '#FF2D55', cursor: 'pointer' }}
                        title="이미지 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Modal Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              취소
            </button>
            <button type="submit" className="btn btn-naver" style={{ padding: '10px 24px' }}>
              <CheckCircle size={16} /> 기록 저장하기
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
