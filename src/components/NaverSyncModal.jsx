import React, { useState, useEffect } from 'react';
import { X, Zap, RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Sparkles, Calendar, BookOpen, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getSavedNaverBlogId, 
  saveNaverBlogId, 
  fetchNaverBlogRss, 
  applyRssPostsToChallengeData,
  sanitizeNaverId 
} from '../utils/naverRss';

export default function NaverSyncModal({ 
  onClose, 
  currentChallengeData, 
  currentYear, 
  currentMonth, 
  onApplySync 
}) {
  const [blogIdInput, setBlogIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rssData, setRssData] = useState(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(null);

  // Today's KST date string YYYY-MM-DD
  const todayStr = (() => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().split('T')[0];
  })();

  // On mount, load saved blog ID
  useEffect(() => {
    const saved = getSavedNaverBlogId();
    if (saved) {
      setBlogIdInput(saved);
      // Auto-fetch if saved ID exists
      handleFetchRss(saved);
    }
  }, []);

  const handleFetchRss = async (idToFetch) => {
    const targetId = sanitizeNaverId(idToFetch || blogIdInput);
    if (!targetId) {
      setError('네이버 블로그 아이디를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSyncSuccessMsg(null);

    const result = await fetchNaverBlogRss(targetId);
    setLoading(false);

    if (result.success) {
      setRssData(result);
      saveNaverBlogId(targetId);
    } else {
      setError(result.error || '네이버 블로그 글을 불러오는데 실패했습니다.');
      setRssData(null);
    }
  };

  // Filter today's posts
  const todayPosts = (rssData?.items || []).filter(item => item.dateKey === todayStr);

  // Filter current month's posts
  const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const monthPosts = (rssData?.items || []).filter(item => item.dateKey && item.dateKey.startsWith(currentMonthPrefix));

  // Sync today's posts only
  const handleSyncToday = () => {
    if (!rssData?.items) return;

    const { updatedData, syncedPostsCount } = applyRssPostsToChallengeData(
      rssData.items, 
      currentChallengeData, 
      todayStr
    );

    if (syncedPostsCount === 0) {
      alert('오늘 작성된 네이버 블로그 글이 없습니다.');
      return;
    }

    onApplySync(updatedData, {
      type: 'today',
      postsCount: syncedPostsCount,
      targetDateKey: todayStr
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setSyncSuccessMsg(`🎉 오늘 작성하신 글 ${syncedPostsCount}건이 캘린더에 자동 인증되었습니다!`);
  };

  // Sync all posts in current month
  const handleSyncMonth = () => {
    if (!rssData?.items) return;

    const { updatedData, syncedPostsCount, syncedDaysCount } = applyRssPostsToChallengeData(
      monthPosts, 
      currentChallengeData, 
      null
    );

    if (syncedPostsCount === 0) {
      alert(`${currentMonth}월에 작성된 네이버 블로그 글이 없습니다.`);
      return;
    }

    onApplySync(updatedData, {
      type: 'month',
      postsCount: syncedPostsCount,
      daysCount: syncedDaysCount
    });

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.6 }
    });

    setSyncSuccessMsg(`✨ 이번 달(${currentMonth}월) 작성 글 ${syncedPostsCount}건(${syncedDaysCount}일치)이 캘린더에 일괄 동기화되었습니다!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(3,199,90,0.3) 0%, rgba(3,199,90,0.1) 100%)',
              border: '1px solid rgba(3,199,90,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--naver-green)'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                네이버 블로그 <span style={{ color: 'var(--naver-green)' }}>1클릭 자동 인증</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                블로그 글의 제목과 링크를 복사할 필요 없이 1초 만에 캘린더에 자동 입력합니다.
              </p>
            </div>
          </div>
          
          <button onClick={onClose} className="btn-icon" style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Blog ID Input Form */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
            네이버 블로그 아이디 (또는 블로그 주소)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input-field"
              value={blogIdInput}
              onChange={(e) => setBlogIdInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleFetchRss(); }}
              placeholder="예: naver_diary 또는 https://blog.naver.com/아이디"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem' }}
            />
            <button
              onClick={() => handleFetchRss()}
              disabled={loading}
              className="btn btn-naver"
              style={{ padding: '10px 18px', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> 조회중...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> 글 불러오기
                </>
              )}
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            💡 블로그 주소 전체를 붙여넣으셔도 자동으로 아이디만 추출되어 브라우저에 안전하게 기억됩니다.
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'rgba(255, 68, 68, 0.15)',
            border: '1px solid rgba(255, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#ff8080',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {syncSuccessMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 18px',
            background: 'rgba(3, 199, 90, 0.15)',
            border: '1px solid rgba(3, 199, 90, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#2ee677',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={20} />
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {/* Loaded Blog Info & Sync Actions */}
        {rssData && (
          <div>
            {/* Blog Profile Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(3,199,90,0.12) 0%, rgba(0,0,0,0.3) 100%)',
              border: '1px solid rgba(3,199,90,0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--naver-green)', fontWeight: 700 }}>
                  연동된 블로그
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '2px' }}>
                  {rssData.channelTitle}
                </div>
              </div>
              <a
                href={rssData.channelLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>내 블로그 가기</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Action Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '22px' }}>
              
              {/* Card 1: Today Sync */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: todayPosts.length > 0 ? '1px solid rgba(3,199,90,0.5)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: todayPosts.length > 0 ? '0 0 15px rgba(3,199,90,0.15)' : 'none'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} style={{ color: 'var(--naver-green)' }} /> 오늘 작성 글 인증
                    </span>
                    <span className={todayPosts.length >= 3 ? "badge badge-gold" : todayPosts.length > 0 ? "badge badge-green" : "badge"} style={{ fontSize: '0.75rem' }}>
                      {todayPosts.length}건 작성됨
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '12px', lineHeight: '1.4' }}>
                    오늘({todayStr}) 네이버에 발행된 글 {todayPosts.length}건을 오늘 캘린더에 1포/2포/3포로 즉시 자동 인증합니다.
                  </p>
                </div>

                <button
                  onClick={handleSyncToday}
                  disabled={todayPosts.length === 0}
                  className="btn btn-naver"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    opacity: todayPosts.length === 0 ? 0.4 : 1,
                    cursor: todayPosts.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Zap size={16} /> 오늘 글 캘린더에 도장 찍기 쾅!
                </button>
              </div>

              {/* Card 2: Current Month Sync */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} style={{ color: 'var(--gold-primary)' }} /> {currentMonth}월 전체 일괄 동기화
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                      {monthPosts.length}건 감지
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '12px', lineHeight: '1.4' }}>
                    피드에 있는 {currentMonth}월 글 {monthPosts.length}건을 날짜별(1일~31일)로 캘린더에 한 번에 채워 넣습니다.
                  </p>
                </div>

                <button
                  onClick={handleSyncMonth}
                  disabled={monthPosts.length === 0}
                  className="btn btn-gold"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    opacity: monthPosts.length === 0 ? 0.4 : 1,
                    cursor: monthPosts.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Sparkles size={16} /> {currentMonth}월 전체 일괄 반영
                </button>
              </div>

            </div>

            {/* Recent Posts Preview Accordion / Feed List */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} /> 최근 블로그 발행 글 목록 ({rssData.items.length}건)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  최신순 정렬
                </span>
              </div>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                padding: '8px'
              }}>
                {rssData.items.map((item, idx) => {
                  const isToday = item.dateKey === todayStr;
                  return (
                    <div 
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderBottom: idx === rssData.items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isToday ? 'rgba(3,199,90,0.25)' : 'rgba(255,255,255,0.08)',
                            color: isToday ? 'var(--naver-green)' : 'var(--text-sub)',
                            fontWeight: isToday ? 700 : 500
                          }}>
                            {isToday ? '🔥 오늘' : item.dateKey} {item.time}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            [{item.category}]
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.title}
                        </div>
                      </div>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon"
                        title="글 열기"
                        style={{ color: 'var(--text-sub)', padding: '6px' }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
