import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronUp, 
  Plus, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Hammer, 
  Lightbulb, 
  Tag, 
  MessageSquare, 
  Filter
} from 'lucide-react';
import NewFeedbackModal from './NewFeedbackModal';
import { getVoterToken } from '../utils/voter';

// Status styling and Korean label map
const STATUS_CONFIG = {
  under_review: {
    label: '💡 검토중',
    bg: 'rgba(0, 208, 255, 0.12)',
    border: 'rgba(0, 208, 255, 0.3)',
    color: '#00D0FF'
  },
  planned: {
    label: '📋 개발예정',
    bg: 'rgba(156, 39, 176, 0.15)',
    border: 'rgba(156, 39, 176, 0.35)',
    color: '#BA68C8'
  },
  in_progress: {
    label: '🔥 개발진행중',
    bg: 'rgba(255, 112, 67, 0.15)',
    border: 'rgba(255, 112, 67, 0.4)',
    color: '#FF7043'
  },
  completed: {
    label: '✅ 반영완료',
    bg: 'rgba(3, 199, 90, 0.15)',
    border: 'rgba(3, 199, 90, 0.4)',
    color: 'var(--naver-green-light)'
  }
};

const CATEGORY_CONFIG = {
  feature: { label: '✨ 신규 기능', color: '#00D0FF' },
  improvement: { label: '⚡ 편의성 개선', color: '#FFB800' },
  bug: { label: '🐛 버그 제보', color: '#FF5252' }
};

export default function FeedbackBoard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState('popular'); // 'popular' | 'latest'
  const [showModal, setShowModal] = useState(false);

  // Fetch feedback items
  const loadFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const voterToken = getVoterToken();
      const params = new URLSearchParams({
        status: statusFilter,
        category: categoryFilter,
        sort: sortMode,
        voterToken
      });

      const res = await fetch(`/api/feedback?${params.toString()}`);
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, sortMode]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  // Handle Upvote Click (Optimistic UI)
  const handleVote = async (feedbackId, currentHasVoted, currentUpvotes) => {
    const voterToken = getVoterToken();

    // 1. Optimistic local update
    const nextHasVoted = !currentHasVoted;
    const nextUpvotes = nextHasVoted ? currentUpvotes + 1 : Math.max(0, currentUpvotes - 1);

    setItems(prev => prev.map(item => {
      if (item.id === feedbackId) {
        return {
          ...item,
          hasVoted: nextHasVoted,
          upvotes: nextUpvotes
        };
      }
      return item;
    }));

    // 2. Server API call
    try {
      const res = await fetch('/api/feedback/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId,
          voterToken
        })
      });

      const data = await res.json();
      if (data && data.success) {
        // Sync with actual server upvotes
        setItems(prev => prev.map(item => {
          if (item.id === feedbackId) {
            return {
              ...item,
              hasVoted: data.hasVoted,
              upvotes: data.upvotes
            };
          }
          return item;
        }));
      }
    } catch (err) {
      console.error('Failed to toggle vote:', err);
      // Rollback on error
      setItems(prev => prev.map(item => {
        if (item.id === feedbackId) {
          return {
            ...item,
            hasVoted: currentHasVoted,
            upvotes: currentUpvotes
          };
        }
        return item;
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
      
      {/* Hero Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(3, 199, 90, 0.1) 0%, rgba(0, 208, 255, 0.08) 100%)',
        border: '1px solid rgba(3, 199, 90, 0.3)'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(3,199,90,0.15)', border: '1px solid rgba(3,199,90,0.3)', color: 'var(--naver-green-light)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
            <Sparkles size={13} /> 1일 3포 챌린저 로드맵
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>
            💡 기능 제안 & 투표소 <span style={{ color: 'var(--naver-green)' }}>(Canny Board)</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
            네이버 블로그 1일 3포 챌린지 앱에 원하는 기능이나 개선 아이디어를 남겨주세요.<br />
            다른 블로거들의 <strong>추천(Upvote)</strong>을 많이 받은 제안부터 최우선으로 개발되어 서비스에 반영됩니다!
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-naver"
          style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 0 20px rgba(3,199,90,0.35)' }}
        >
          <Plus size={18} />
          <span>새로운 제안 남기기</span>
        </button>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '전체보기' },
            { key: 'under_review', label: '💡 검토중' },
            { key: 'planned', label: '📋 개발예정' },
            { key: 'in_progress', label: '🔥 진행중' },
            { key: 'completed', label: '✅ 반영완료' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: statusFilter === tab.key ? '1px solid var(--naver-green)' : '1px solid var(--border-color)',
                background: statusFilter === tab.key ? 'rgba(3, 199, 90, 0.15)' : 'transparent',
                color: statusFilter === tab.key ? 'var(--naver-green-light)' : 'var(--text-sub)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Sort & Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">모든 분류</option>
            <option value="feature">✨ 신규 기능</option>
            <option value="improvement">⚡ 편의성 개선</option>
            <option value="bug">🐛 버그 제보</option>
          </select>

          {/* Sort Buttons */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <button
              onClick={() => setSortMode('popular')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                background: sortMode === 'popular' ? 'var(--naver-green)' : 'transparent',
                color: sortMode === 'popular' ? '#fff' : 'var(--text-sub)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Flame size={13} /> 인기순
            </button>
            <button
              onClick={() => setSortMode('latest')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                background: sortMode === 'latest' ? 'var(--naver-green)' : 'transparent',
                color: sortMode === 'latest' ? '#fff' : 'var(--text-sub)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Clock size={13} /> 최신순
            </button>
          </div>
        </div>

      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-sub)' }}>
            <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--naver-green)' }} />
            <p>제안 목록을 불러오는 중입니다...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Lightbulb size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>아직 등록된 제안이 없습니다</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '20px' }}>
              이 분류의 첫 번째 아이디어 주인공이 되어보세요!
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-naver" style={{ padding: '10px 20px' }}>
              <Plus size={16} /> 첫 제안 남기기
            </button>
          </div>
        ) : (
          items.map(item => {
            const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG.under_review;
            const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.feature;
            const dateStr = item.created_at ? item.created_at.split(' ')[0] : '';

            return (
              <div 
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  transition: 'all 0.2s',
                  border: item.hasVoted ? '1px solid rgba(3, 199, 90, 0.4)' : '1px solid var(--border-color)'
                }}
              >
                {/* Upvote Button (Canny Style) */}
                <button
                  onClick={() => handleVote(item.id, item.hasVoted, item.upvotes)}
                  title={item.hasVoted ? '추천 취소' : '이 제안 추천하기'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '58px',
                    padding: '10px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: item.hasVoted ? '1px solid var(--naver-green)' : '1px solid var(--border-color)',
                    background: item.hasVoted 
                      ? 'linear-gradient(135deg, rgba(3,199,90,0.25) 0%, rgba(0,208,255,0.2) 100%)' 
                      : 'rgba(0,0,0,0.25)',
                    color: item.hasVoted ? 'var(--naver-green-light)' : 'var(--text-sub)',
                    cursor: 'pointer',
                    boxShadow: item.hasVoted ? '0 0 12px rgba(3,199,90,0.3)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  <ChevronUp size={22} style={{ strokeWidth: 3, marginBottom: '2px' }} />
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
                    {item.upvotes}
                  </span>
                </button>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {/* Status Badge */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      color: statusStyle.color
                    }}>
                      {statusStyle.label}
                    </span>

                    {/* Category Badge */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-color)',
                      color: catConfig.color
                    }}>
                      {catConfig.label}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      • {item.author || '익명의 블로거'} {dateStr ? `(${dateStr})` : ''}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Feedback Modal */}
      {showModal && (
        <NewFeedbackModal
          onClose={() => setShowModal(false)}
          onSuccess={(newItem) => {
            setItems(prev => [newItem, ...prev]);
          }}
        />
      )}

    </div>
  );
}
