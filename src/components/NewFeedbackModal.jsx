import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { getVoterToken } from '../utils/voter';

export default function NewFeedbackModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const voterToken = getVoterToken();
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          author: author.trim() || '익명의 블로거',
          voterToken
        })
      });

      const data = await res.json();
      if (data.success && data.item) {
        onSuccess(data.item);
        onClose();
      } else {
        setError(data.error || '제안 등록 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div 
        className="glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--naver-green)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>새로운 기능 제안 & 개선 건의</h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              background: 'rgba(255, 68, 68, 0.15)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: '#ff6b6b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '6px' }}>
              제안 분류
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { value: 'feature', label: '✨ 신규 기능' },
                { value: 'improvement', label: '⚡ 편의성 개선' },
                { value: 'bug', label: '🐛 버그 제보' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  style={{
                    padding: '8px 10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: category === cat.value ? '1px solid var(--naver-green)' : '1px solid var(--border-color)',
                    background: category === cat.value ? 'rgba(3, 199, 90, 0.15)' : 'rgba(0,0,0,0.2)',
                    color: category === cat.value ? 'var(--naver-green-light)' : 'var(--text-sub)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '6px' }}>
              제안 제목 <span style={{ color: 'var(--naver-green)' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 홈 화면에 추가할 수 있는 앱 위젯이 있으면 좋겠습니다"
              maxLength={100}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '6px' }}>
              상세 설명
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="제안하고 싶은 이유나 구체적인 사용 흐름을 자유롭게 적어주세요. 다른 블로거들이 공감하면 추천을 눌러 개발 우선순위에 반영됩니다!"
              maxLength={1000}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Author */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '6px' }}>
              작성자 닉네임 (선택)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="익명의 블로거"
              maxLength={20}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '10px 18px' }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-naver"
              style={{ padding: '10px 22px' }}
            >
              <Send size={16} />
              <span>{loading ? '등록 중...' : '제안 등록하기 🚀'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
