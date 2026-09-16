// Visitor Counter Tracking Utility for Naver Blog Challenge
// Connected to Cloudflare D1 Real-Time Analytics

const VISITOR_KEY = 'po3_visitor_stats_data';
const SESSION_KEY = 'po3_session_logged';

// Synchronous cached getter for immediate rendering (no flicker)
export function getVisitorStats() {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    let stats = raw ? JSON.parse(raw) : null;

    if (!stats || stats.todayDate !== todayStr) {
      const prevTotal = stats ? stats.totalCount : 0;
      stats = {
        todayDate: todayStr,
        activeNow: 1,
        todayCount: stats ? stats.todayCount : 1,
        totalCount: prevTotal || 1,
        lastVisit: Date.now()
      };
      localStorage.setItem(VISITOR_KEY, JSON.stringify(stats));
    }

    return stats;
  } catch (e) {
    return {
      todayDate: todayStr,
      activeNow: 1,
      todayCount: 1,
      totalCount: 1,
      lastVisit: Date.now()
    };
  }
}

// Asynchronously record visit to Cloudflare D1 and fetch live real-time stats
export async function fetchAndRecordVisit() {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const alreadyLogged = sessionStorage.getItem(SESSION_KEY);
    const method = alreadyLogged ? 'GET' : 'POST';

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (method === 'POST') {
      options.body = JSON.stringify({
        referrer: document.referrer || '',
        path: window.location.pathname || '/'
      });
    }

    const res = await fetch('/api/visit', options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data && (data.todayCount !== undefined || data.totalCount !== undefined)) {
      const newStats = {
        todayDate: todayStr,
        activeNow: data.activeNow ?? 1,
        todayCount: data.todayCount ?? 1,
        totalCount: data.totalCount ?? 1,
        lastVisit: Date.now()
      };

      if (method === 'POST') {
        sessionStorage.setItem(SESSION_KEY, 'true');
      }

      localStorage.setItem(VISITOR_KEY, JSON.stringify(newStats));
      return newStats;
    }
  } catch (err) {
    console.debug('Visitor API offline or not yet configured, using local stats:', err.message);
  }

  return getVisitorStats();
}

// Poll live stats without re-recording visit
export async function pollLiveStats() {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch('/api/visit');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.todayCount !== undefined) {
      const newStats = {
        todayDate: todayStr,
        activeNow: data.activeNow ?? 1,
        todayCount: data.todayCount,
        totalCount: data.totalCount,
        lastVisit: Date.now()
      };
      localStorage.setItem(VISITOR_KEY, JSON.stringify(newStats));
      return newStats;
    }
  } catch (err) {
    // silent
  }
  return null;
}
