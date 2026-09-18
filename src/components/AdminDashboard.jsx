import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  RefreshCw, 
  Home, 
  Users, 
  Flame, 
  MessageSquarePlus, 
  TrendingUp, 
  Globe, 
  ExternalLink, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  Filter
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'po3_admin_token';

export default function AdminDashboard({ onExitAdmin }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(ADMIN_STORAGE_KEY) || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('traffic'); // 'traffic' | 'feedback' | 'challenger'
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Status Filter for Feedback Management
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login handler
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('관리자 암호를 입력해주세요.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() })
      });

      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setAuthError('인증 서버 연결에 실패했습니다.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setToken('');
    setStatsData(null);
  };

  // Fetch Admin Stats
  const fetchStats = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);

    try {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token
        }
      });

      if (res.status === 401) {
        handleLogout();
        setAuthError('세션이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStatsData(data);
      } else {
        showToast('통계 데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error(err);
      showToast('네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingStats(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, fetchStats]);

  // Update Feedback Status
  const handleUpdateFeedbackStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`제안 #${id}의 상태를 [${getStatusLabel(newStatus)}] (으)로 변경했습니다.`);
        // Optimistic UI update
        setStatsData(prev => ({
          ...prev,
          feedback: prev.feedback.map(item => item.id === id ? { ...item, status: newStatus } : item)
        }));
      } else {
        alert(data.error || '상태 변경에 실패했습니다.');
      }
    } catch {
      alert('상태 변경 요청 중 오류가 발생했습니다.');
    }
  };

  // Delete Feedback Item
  const handleDeleteFeedback = async (id, title) => {
    if (!window.confirm(`정말로 이 제안을 삭제하시겠습니까?\n\n"${title}"\n\n(삭제 시 되돌릴 수 없으며 투표 기록도 함께 삭제됩니다)`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-admin-key': token
        }
      });

      const data = await res.json();
      if (data.success) {
        showToast(`제안 #${id}이(가) 완전히 삭제되었습니다.`);
        setStatsData(prev => ({
          ...prev,
          feedback: prev.feedback.filter(item => item.id !== id)
        }));
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch {
      alert('삭제 처리 중 오류가 발생했습니다.');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'under_review': return '💡 검토중';
      case 'planned': return '📋 개발예정';
      case 'in_progress': return '🔥 개발진행중';
      case 'completed': return '✅ 반영완료';
      default: return status;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'under_review':
        return { background: 'rgba(255, 184, 0, 0.15)', color: '#FFB800', border: '1px solid rgba(255, 184, 0, 0.3)' };
      case 'planned':
        return { background: 'rgba(33, 150, 243, 0.15)', color: '#2196F3', border: '1px solid rgba(33, 150, 243, 0.3)' };
      case 'in_progress':
        return { background: 'rgba(255, 87, 34, 0.15)', color: '#FF5722', border: '1px solid rgba(255, 87, 34, 0.3)' };
      case 'completed':
        return { background: 'rgba(3, 199, 90, 0.15)', color: '#03C75A', border: '1px solid rgba(3, 199, 90, 0.3)' };
      default:
        return { background: 'rgba(255, 255, 255, 0.1)', color: '#ccc' };
    }
  };

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 30px',
          border: '1px solid rgba(3,199,90,0.3)',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(3,199,90,0.3) 0%, rgba(255,184,0,0.2) 100%)',
              border: '1px solid rgba(3,199,90,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--naver-green)'
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              po3.site <span style={{ color: 'var(--naver-green)' }}>관리자 콘솔</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '6px' }}>
              운영자 비밀번호를 입력하여 관리자 화면에 접근하세요.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                관리자 암호
              </label>
              <input
                type="password"
                className="input-field"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력..."
                style={{ width: '100%', padding: '12px 14px', fontSize: '1rem' }}
                autoFocus
              />
            </div>

            {authError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(255, 68, 68, 0.15)',
                border: '1px solid rgba(255, 68, 68, 0.4)',
                borderRadius: 'var(--radius-md)',
                color: '#ff8080',
                fontSize: '0.85rem',
                marginBottom: '18px'
              }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="btn btn-naver"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px' }}
            >
              {authLoading ? '인증 확인 중...' : '관리자 콘솔 로그인'}
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
            >
              <Home size={15} /> 메인 화면으로 돌아가기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DASHBOARD MAIN VIEW
  // -------------------------------------------------------------
  const traffic = statsData?.traffic || { activeNow: 1, todayVisitors: 0, totalVisitors: 0, topReferrers: [], topLocations: [], recentLogs: [] };
  const challenger = statsData?.challenger || { todayPosts: 0, todayFinishers: 0, totalPosts: 0, recentEvents: [] };
  const allFeedback = statsData?.feedback || [];

  const filteredFeedback = feedbackStatusFilter === 'all'
    ? allFeedback
    : allFeedback.filter(item => item.status === feedbackStatusFilter);

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(3, 199, 90, 0.95)',
          color: '#000',
          fontWeight: 800,
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        border: '1px solid rgba(3,199,90,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(3,199,90,0.3) 0%, rgba(0,0,0,0.4) 100%)',
            border: '1px solid rgba(3,199,90,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--naver-green)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                ADMIN CONSOLE
              </span>
              <span style={{ fontSize: '0.75rem', color: '#2ee677', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ee677' }}></span>
                Cloudflare D1 Live
              </span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '2px' }}>
              po3.site <span style={{ color: 'var(--naver-green)' }}>통합 운영자 관리 콘솔</span>
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchStats}
            disabled={loadingStats}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="실시간 데이터 새로고침"
          >
            <RefreshCw size={15} className={loadingStats ? "animate-spin" : ""} />
            <span>새로고침</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="btn btn-naver"
            style={{ padding: '8px 14px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <Home size={15} />
            <span>메인 대시보드로</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="관리자 로그아웃"
          >
            <LogOut size={15} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: 'rgba(0,0,0,0.3)',
        padding: '6px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('traffic')}
          className={activeTab === 'traffic' ? 'btn btn-naver' : 'btn btn-secondary'}
          style={{ padding: '10px 20px', fontWeight: 700 }}
        >
          <TrendingUp size={16} /> 📊 트래픽 & 유입 출처 분석
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={activeTab === 'feedback' ? 'btn btn-gold' : 'btn btn-secondary'}
          style={{ padding: '10px 20px', fontWeight: 700 }}
        >
          <MessageSquarePlus size={16} /> 💡 기능 제안 & 로드맵 상태 관리 ({allFeedback.length})
        </button>

        <button
          onClick={() => setActiveTab('challenger')}
          className={activeTab === 'challenger' ? 'btn btn-blue' : 'btn btn-secondary'}
          style={{ padding: '10px 20px', fontWeight: 700 }}
        >
          <Flame size={16} /> 🚀 챌린저 활동 & 완주 로그
        </button>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* TAB 1: TRAFFIC & REFERRERS */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'traffic' && (
        <div>
          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            
            {/* Active Live */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #2ee677' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>현재 접속 중 (LIVE)</span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ee677', boxShadow: '0 0 8px #2ee677' }}></span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2ee677' }}>
                {traffic.activeNow} <span style={{ fontSize: '1rem', fontWeight: 500 }}>명</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                최근 10분 내 활동 사용자
              </div>
            </div>

            {/* Today Visitors */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--naver-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>오늘 순방문자 (UV)</span>
                <Users size={18} style={{ color: 'var(--naver-green)' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {traffic.todayVisitors.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>명</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                KST 오늘 고유 IP 방문자
              </div>
            </div>

            {/* Total Visitors */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--gold-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>누적 총 방문자</span>
                <Globe size={18} style={{ color: 'var(--gold-primary)' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold-primary)' }}>
                {traffic.totalVisitors.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>명</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                D1 론칭 이후 전체 누적 고유 방문자
              </div>
            </div>

          </div>

          {/* Top Referrers Ranking & Top Locations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            
            {/* Referrers */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--naver-green)' }} />
                <span>유입 출처 랭킹 TOP 10 (Referrers)</span>
              </h3>

              {traffic.topReferrers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  유입 로그가 아직 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {traffic.topReferrers.map((item, idx) => {
                    const maxCount = traffic.topReferrers[0]?.count || 1;
                    const percent = Math.round((item.count / maxCount) * 100);
                    return (
                      <div key={idx} style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                            <span style={{ color: idx < 3 ? 'var(--gold-primary)' : 'var(--text-muted)', marginRight: '6px' }}>#{idx + 1}</span>
                            {item.source}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--naver-green)' }}>
                            {item.count}회
                          </span>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${percent}%`,
                            height: '100%',
                            background: idx < 3 ? 'var(--gold-gradient)' : 'var(--naver-green)',
                            borderRadius: '3px'
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Locations */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: 'var(--gold-primary)' }} />
                <span>접속 국가 & 도시 TOP 10</span>
              </h3>

              {traffic.topLocations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  위치 로그가 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {traffic.topLocations.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{idx + 1}</span>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.country}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginLeft: '6px' }}>({item.city})</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {item.count}회
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Recent 50 Visitor Logs Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--text-sub)' }} />
              <span>최근 실시간 접속자 로그 (최근 50건)</span>
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>접속일시 (UTC/KST)</th>
                    <th style={{ padding: '10px' }}>식별 해시 (IP Hash)</th>
                    <th style={{ padding: '10px' }}>지역</th>
                    <th style={{ padding: '10px' }}>유입 출처 (Referrer)</th>
                    <th style={{ padding: '10px' }}>페이지</th>
                  </tr>
                </thead>
                <tbody>
                  {traffic.recentLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>{log.created_at}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', color: 'var(--naver-green)' }}>{log.ip_hash}</td>
                      <td style={{ padding: '10px' }}>{log.country || 'KR'} ({log.city || 'Seoul'})</td>
                      <td style={{ padding: '10px', color: log.referrer ? 'var(--text-main)' : 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.referrer || '직접 접속'}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-sub)' }}>{log.path || '/'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* TAB 2: FEEDBACK & ROADMAP STATUS MANAGEMENT */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'feedback' && (
        <div>
          {/* Top Status Filters */}
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, marginRight: '6px' }}>상태 필터:</span>
              {[
                { key: 'all', label: '전체보기' },
                { key: 'under_review', label: '💡 검토중' },
                { key: 'planned', label: '📋 개발예정' },
                { key: 'in_progress', label: '🔥 개발진행중' },
                { key: 'completed', label: '✅ 반영완료' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFeedbackStatusFilter(tab.key)}
                  className={feedbackStatusFilter === tab.key ? 'btn btn-naver' : 'btn btn-secondary'}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              총 <strong>{filteredFeedback.length}</strong>건의 제안
            </div>
          </div>

          {/* Feedback Items Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px', width: '50px' }}>ID</th>
                    <th style={{ padding: '12px 10px', width: '70px' }}>추천수</th>
                    <th style={{ padding: '12px 10px', width: '90px' }}>분류</th>
                    <th style={{ padding: '12px 10px' }}>제안 내용 (제목 & 설명)</th>
                    <th style={{ padding: '12px 10px', width: '100px' }}>작성자</th>
                    <th style={{ padding: '12px 10px', width: '160px' }}>로드맵 상태 변경</th>
                    <th style={{ padding: '12px 10px', width: '60px', textAlign: 'center' }}>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        #{item.id}
                      </td>
                      <td style={{ padding: '14px 10px', fontWeight: 800, color: 'var(--naver-green)' }}>
                        ▲ {item.upvotes}
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)' }}>
                          {item.category === 'feature' ? '신규기능' : item.category === 'bug' ? '버그제보' : '개선사항'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: '1.4' }}>
                          {item.description}
                        </div>
                      </td>
                      <td style={{ padding: '14px 10px', color: 'var(--text-sub)', fontSize: '0.8rem' }}>
                        {item.author || '익명'}
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                            ...getStatusBadgeStyle(item.status)
                          }}
                        >
                          <option value="under_review">💡 검토중</option>
                          <option value="planned">📋 개발예정</option>
                          <option value="in_progress">🔥 개발진행중</option>
                          <option value="completed">✅ 반영완료</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteFeedback(item.id, item.title)}
                          className="btn-icon"
                          title="제안 삭제"
                          style={{ color: '#ff6666', padding: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* TAB 3: CHALLENGER MONITOR */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'challenger' && (
        <div>
          {/* Challenger KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--naver-green)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>오늘 등록된 포스팅</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--naver-green)', marginTop: '4px' }}>
                {challenger.todayPosts} <span style={{ fontSize: '1rem', fontWeight: 500 }}>건</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--gold-primary)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>오늘의 3포 완주 챌린저</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold-primary)', marginTop: '4px' }}>
                {challenger.todayFinishers} <span style={{ fontSize: '1rem', fontWeight: 500 }}>명</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #2196F3' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 600 }}>누적 전체 챌린지 포스팅</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2196F3', marginTop: '4px' }}>
                {challenger.totalPosts.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>건</span>
              </div>
            </div>
          </div>

          {/* Recent Challenger Activities Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>최근 챌린저 활동 피드 로그 (최근 30건)</span>
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>기록 일시</th>
                    <th style={{ padding: '10px' }}>챌린저 닉네임</th>
                    <th style={{ padding: '10px' }}>이벤트 유형</th>
                    <th style={{ padding: '10px' }}>포스팅 번호</th>
                    <th style={{ padding: '10px' }}>글 제목</th>
                    <th style={{ padding: '10px' }}>카테고리</th>
                  </tr>
                </thead>
                <tbody>
                  {challenger.recentEvents.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>{ev.created_at}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: 'var(--text-main)' }}>{ev.nickname}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: ev.event_type === 'day_finished' ? 'rgba(255, 184, 0, 0.2)' : 'rgba(3, 199, 90, 0.2)',
                          color: ev.event_type === 'day_finished' ? 'var(--gold-primary)' : 'var(--naver-green)',
                          fontWeight: 700
                        }}>
                          {ev.event_type === 'day_finished' ? '🎉 완주 달성' : '✍️ 포스팅 완료'}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{ev.post_number}포</td>
                      <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-main)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.post_title}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-sub)' }}>{ev.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
