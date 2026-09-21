// Multi-device Cloud Sync Utility for po3.site

const DEVICE_TOKEN_KEY = 'po3_device_token';
const PIN_CACHE_KEY = 'po3_cached_pin';

/**
 * Get or create unique device token
 */
export function getDeviceToken() {
  try {
    let token = localStorage.getItem(DEVICE_TOKEN_KEY);
    if (!token) {
      token = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return `dev_fallback_${Date.now()}`;
  }
}

/**
 * Get cached PIN for this blog ID (if verified on this device)
 */
export function getCachedPin(blogId) {
  try {
    const raw = localStorage.getItem(`${PIN_CACHE_KEY}_${blogId}`);
    return raw || '';
  } catch {
    return '';
  }
}

/**
 * Save cached PIN for this blog ID
 */
export function setCachedPin(blogId, pin) {
  try {
    if (pin) {
      localStorage.setItem(`${PIN_CACHE_KEY}_${blogId}`, pin);
    } else {
      localStorage.removeItem(`${PIN_CACHE_KEY}_${blogId}`);
    }
  } catch {}
}

/**
 * Fetch calendar data from Cloudflare D1
 */
export async function fetchCloudCalendar(blogId, pin = '') {
  if (!blogId) return { success: false, error: '블로그 아이디가 없습니다.' };

  const token = getDeviceToken();
  const effectivePin = pin || getCachedPin(blogId);

  try {
    const url = `/api/sync?blogId=${encodeURIComponent(blogId)}&token=${encodeURIComponent(token)}&pin=${encodeURIComponent(effectivePin)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success && data.verified && effectivePin) {
      setCachedPin(blogId, effectivePin);
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch cloud calendar:', err);
    return { success: false, error: '클라우드 데이터를 불러오는 중 네트워크 오류가 발생했습니다.' };
  }
}

/**
 * Save calendar data to Cloudflare D1
 */
export async function pushCloudCalendar(blogId, calendarData, pin = '') {
  if (!blogId || !calendarData) return { success: false, error: '데이터가 누락되었습니다.' };

  const token = getDeviceToken();
  const effectivePin = pin || getCachedPin(blogId);

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blogId,
        calendarData,
        token,
        pin: effectivePin
      })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to push cloud calendar:', err);
    return { success: false, error: '클라우드 저장 중 오류가 발생했습니다.' };
  }
}

/**
 * Set or change 4-digit PIN lock
 */
export async function setCloudPin(blogId, pin, oldPin = '') {
  const token = getDeviceToken();
  try {
    const res = await fetch('/api/sync/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blogId,
        action: 'set',
        pin,
        oldPin,
        token
      })
    });
    const data = await res.json();
    if (data.success) {
      setCachedPin(blogId, pin);
    }
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Remove 4-digit PIN lock
 */
export async function removeCloudPin(blogId, oldPin = '') {
  const token = getDeviceToken();
  try {
    const res = await fetch('/api/sync/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blogId,
        action: 'remove',
        oldPin: oldPin || getCachedPin(blogId),
        token
      })
    });
    const data = await res.json();
    if (data.success) {
      setCachedPin(blogId, '');
    }
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Smart merge local calendar and cloud calendar data
 * Ensures neither desktop nor mobile entries get wiped out
 */
export function mergeCalendars(localData = {}, cloudData = {}) {
  if (!cloudData || Object.keys(cloudData).length === 0) return localData;
  if (!localData || Object.keys(localData).length === 0) return cloudData;

  const merged = { ...localData };

  Object.entries(cloudData).forEach(([dateKey, cloudDay]) => {
    const localDay = merged[dateKey];

    if (!localDay) {
      merged[dateKey] = cloudDay;
      return;
    }

    const localPosts = localDay.posts || [];
    const cloudPosts = cloudDay.posts || [];

    const localCompleted = localPosts.filter(p => p.completed).length;
    const cloudCompleted = cloudPosts.filter(p => p.completed).length;

    // If cloud has more completed posts, prefer cloud
    if (cloudCompleted > localCompleted) {
      merged[dateKey] = cloudDay;
      return;
    }

    // If equal or local has more, merge slot by slot to preserve titles & URLs
    const maxLen = Math.max(localPosts.length, cloudPosts.length, 3);
    const mergedPosts = [];

    for (let i = 0; i < maxLen; i++) {
      const lp = localPosts[i] || {};
      const cp = cloudPosts[i] || {};

      const isCompleted = lp.completed || cp.completed;
      const title = lp.title || cp.title || '';
      const url = lp.url || cp.url || '';
      const category = lp.category || cp.category || '일상';
      const image = lp.image || cp.image || '';
      const note = lp.note || cp.note || '';

      mergedPosts.push({
        id: lp.id || cp.id || i + 1,
        completed: Boolean(isCompleted),
        title,
        url,
        category,
        image,
        note
      });
    }

    merged[dateKey] = {
      date: dateKey,
      posts: mergedPosts
    };
  });

  return merged;
}
