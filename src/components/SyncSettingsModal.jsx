import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  AlertCircle,
  HelpCircle,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';
import { 
  fetchCloudCalendar, 
  pushCloudCalendar, 
  setCloudPin, 
  removeCloudPin, 
  mergeCalendars, 
  getCachedPin 
} from '../utils/sync';
import { saveChallengeData } from '../utils/storage';

export default function SyncSettingsModal({ 
  onClose, 
  blogId, 
  onUpdateBlogId, 
  challengeData, 
  onApplyMergedData 
}) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // PIN lock states
  const [isLocked, setIsLocked] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [oldPinInput, setOldPinInput] = useState('');
  const [actionType, setActionType] = useState('set'); // 'set' | 'remove' | 'verify'

  // Input for new blog ID if not yet set
  const [newBlogIdInput, setNewBlogIdInput] = useState(blogId || '');

  // Check current cloud status on mount
  React.useEffect(() => {
    if (blogId) {
      checkStatus(blogId);
    }
  }, [blogId]);

  const checkStatus = async (targetId) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchCloudCalendar(targetId);
      if (res.success && res.exists) {
        setIsLocked(Boolean(res.isLocked));
        if (res.isLocked && !res.verified) {
          setShowPinInput(true);
          setActionType('verify');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Immediate upload to cloud
  const handleManualUpload = async () => {
    if (!blogId) {
      setErrorMsg('먼저 네이버 블로그 아이디를 등록해주세요.');
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    const res = await pushCloudCalendar(blogId, challengeData);
    setLoading(false);

    if (res.success) {
      setStatusMsg('✅ 현재 기기의 캘린더 기록이 클라우드에 안전하게 백업되었습니다.');
    } else {
      setErrorMsg(res.error || '클라우드 저장에 실패했습니다.');
      if (res.isLocked) {
        setShowPinInput(true);
        setActionType('verify');
      }
    }
  };

  // Immediate pull & merge from cloud
  const handleManualPull = async (verifyPin = '') => {
    if (!blogId) {
      setErrorMsg('먼저 네이버 블로그 아이디를 등록해주세요.');
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    const res = await fetchCloudCalendar(blogId, verifyPin);
    setLoading(false);

    if (res.success) {
      if (!res.exists) {
        setStatusMsg('💡 클라우드에 아직 저장된 데이터가 없습니다. [지금 캘린더 백업하기]를 먼저 눌러주세요.');
        return;
      }

      if (res.isLocked && !res.verified) {
        setShowPinInput(true);
        setActionType('verify');
        setErrorMsg('이 블로그는 4자리 PIN으로 보호되어 있습니다. PIN을 입력해주세요.');
        return;
      }

      // Merge cloud data with local
      const merged = mergeCalendars(challengeData, res.calendarData);
      onApplyMergedData(merged);
      saveChallengeData(merged);

      setStatusMsg('✨ 클라우드의 최신 캘린더 데이터와 성공적으로 병합 동기화되었습니다!');
      setShowPinInput(false);
      setPinInput('');
    } else {
      setErrorMsg(res.error || '데이터를 불러오지 못했습니다.');
    }
  };

  // Handle PIN save or remove
  const handlePinAction = async () => {
    if (actionType === 'verify') {
      if (!pinInput || pinInput.length !== 4) {
        setErrorMsg('4자리 숫자 PIN을 입력해주세요.');
        return;
      }
      handleManualPull(pinInput);
      return;
    }

    if (actionType === 'set') {
      if (!/^\d{4}$/.test(pinInput)) {
        setErrorMsg('PIN은 숫자 4자리로 입력해주세요 (예: 1234)');
        return;
      }
      setLoading(true);
      setErrorMsg(null);
      const res = await setCloudPin(blogId, pinInput, oldPinInput);
      setLoading(false);

      if (res.success) {
        setIsLocked(true);
        setShowPinInput(false);
        setPinInput('');
        setOldPinInput('');
        setStatusMsg('🔒 4자리 보안 PIN 잠금이 설정되었습니다. 다른 기기에서 첫 접속 시 이 번호를 입력해야 합니다.');
      } else {
        setErrorMsg(res.error || 'PIN 설정에 실패했습니다.');
      }
    } else if (actionType === 'remove') {
      setLoading(true);
      setErrorMsg(null);
      const res = await removeCloudPin(blogId, oldPinInput);
      setLoading(false);

      if (res.success) {
        setIsLocked(false);
        setShowPinInput(false);
        setOldPinInput('');
        setStatusMsg('🔓 보안 PIN 잠금이 해제되었습니다. 이제 아이디만으로 자유롭게 동기화됩니다.');
      } else {
        setErrorMsg(res.error || 'PIN 해제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(3, 199, 90, 0.2) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2196F3'
            }}>
              <Cloud size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                데스크탑 & 모바일 <span style={{ color: '#2196F3' }}>실시간 클라우드 연동</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                네이버 블로그 아이디 하나로 PC와 스마트폰 캘린더가 1초 만에 일치됩니다.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Sync Mechanism Graphic Guide */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '8px 0 14px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto', color: 'var(--text-main)' }}>
                <Laptop size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>데스크탑 (PC)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: '#03C75A', fontWeight: 700 }}>실시간 양방향 동기화</span>
              <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, #2196F3, #03C75A)' }}></div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cloudflare D1</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto', color: '#03C75A' }}>
                <Smartphone size={20} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>스마트폰 (모바일)</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', textAlign: 'center', lineHeight: '1.4' }}>
            스마트폰에서 <strong>po3.site</strong>에 접속해 동일한 네이버 블로그 아이디만 입력하면, PC에서 작성한 캘린더 도장과 글이 그대로 복원됩니다!
          </p>
        </div>

        {/* Current Linked Blog ID Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(3,199,90,0.1) 0%, rgba(33,150,243,0.08) 100%)',
          border: '1px solid rgba(3,199,90,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600 }}>동기화 계정 (네이버 블로그 ID)</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '4px',
              background: isLocked ? 'rgba(255, 184, 0, 0.2)' : 'rgba(3, 199, 90, 0.2)',
              color: isLocked ? 'var(--gold-primary)' : 'var(--naver-green)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {isLocked ? '4자리 PIN 잠금 보호중' : '자유 자동 연동 (무설정)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.5px' }}>
              {blogId ? blogId : '등록된 아이디 없음'}
            </span>
            {blogId && (
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                연동 완료
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alerts */}
        {statusMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 14px',
            background: 'rgba(3, 199, 90, 0.15)',
            border: '1px solid rgba(3, 199, 90, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#2ee677',
            fontSize: '0.85rem',
            marginBottom: '18px'
          }}>
            <CheckCircle2 size={18} />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 14px',
            background: 'rgba(255, 68, 68, 0.15)',
            border: '1px solid rgba(255, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#ff8080',
            fontSize: '0.85rem',
            marginBottom: '18px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PIN Input Box (Appears when setting PIN or verifying) */}
        {showPinInput && (
          <div style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255, 184, 0, 0.5)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} />
              {actionType === 'verify' ? '보안 PIN 4자리 확인' : actionType === 'set' ? '신규 4자리 PIN 설정' : 'PIN 잠금 해제'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginBottom: '12px' }}>
              {actionType === 'verify'
                ? '이 블로그의 캘린더 기록을 불러오려면 설정된 4자리 PIN을 입력하세요.'
                : actionType === 'set'
                ? 'PIN을 설정하면 다른 기기에서 내 아이디를 입력할 때 4자리 암호를 묻습니다.'
                : '현재 등록된 4자리 PIN을 입력하여 자유 연동 모드로 전환합니다.'}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {actionType === 'set' && isLocked && (
                <input
                  type="password"
                  maxLength={4}
                  className="input-field"
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  placeholder="기존 PIN"
                  style={{ width: '100px', textAlign: 'center', fontSize: '1rem', letterSpacing: '4px' }}
                />
              )}
              {actionType === 'remove' ? (
                <input
                  type="password"
                  maxLength={4}
                  className="input-field"
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  placeholder="현재 PIN"
                  style={{ width: '120px', textAlign: 'center', fontSize: '1rem', letterSpacing: '4px' }}
                />
              ) : (
                <input
                  type="password"
                  maxLength={4}
                  className="input-field"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="숫자 4자리"
                  style={{ width: '120px', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '4px' }}
                />
              )}

              <button onClick={handlePinAction} disabled={loading} className="btn btn-gold" style={{ padding: '8px 16px', fontWeight: 700 }}>
                {loading ? '처리 중...' : actionType === 'verify' ? '인증 및 불러오기' : actionType === 'set' ? 'PIN 설정 완료' : '잠금 해제'}
              </button>
              <button onClick={() => setShowPinInput(false)} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                취소
              </button>
            </div>
          </div>
        )}

        {/* Sync Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handleManualUpload}
            disabled={loading || !blogId}
            className="btn btn-naver"
            style={{ padding: '12px', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <UploadCloud size={17} />
            <span>지금 캘린더 클라우드에 백업</span>
          </button>

          <button
            onClick={() => handleManualPull()}
            disabled={loading || !blogId}
            className="btn btn-secondary"
            style={{ padding: '12px', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <DownloadCloud size={17} />
            <span>클라우드에서 최신 데이터 가져오기</span>
          </button>
        </div>

        {/* Security PIN Lock Section (Option B) */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: isLocked ? 'var(--gold-primary)' : 'var(--text-muted)' }} />
              <span>4자리 보안 PIN 잠금 (선택 사항)</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isLocked 
                ? '현재 4자리 PIN으로 보호 중입니다. 다른 기기에서 첫 접속 시 암호가 필요합니다.'
                : '타인이 내 블로그 아이디로 캘린더를 덮어쓰지 못하도록 비밀번호를 걸 수 있습니다.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {isLocked ? (
              <>
                <button
                  onClick={() => { setShowPinInput(true); setActionType('set'); setPinInput(''); setOldPinInput(''); }}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  PIN 변경
                </button>
                <button
                  onClick={() => { setShowPinInput(true); setActionType('remove'); setOldPinInput(''); }}
                  className="btn btn-danger"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  잠금 해제
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowPinInput(true); setActionType('set'); setPinInput(''); }}
                disabled={!blogId}
                className="btn btn-gold"
                style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <Lock size={14} /> 4자리 PIN 설정
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
