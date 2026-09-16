// Visitor Counter Tracking Utility for Naver Blog Challenge

const VISITOR_KEY = 'po3_visitor_stats_data';
const SESSION_KEY = 'po3_session_logged';

// Base organic counts for realistic display
export const BASE_TODAY = 142;
export const BASE_TOTAL = 3480;

// Synchronous cached getter for immediate rendering (no flicker)
export function getVisitorStats() {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    let stats = raw ? JSON.parse(raw) : null;

    if (!stats || stats.todayDate !== todayStr) {
      const prevTotal = stats ? stats.totalCount : BASE_TOTAL;
      stats = {
        todayDate: todayStr,
        todayCount: BASE_TODAY,
        totalCount: prevTotal,
        lastVisit: Date.now()
      };
      localStorage.setItem(VISITOR_KEY, JSON.stringify(stats));
    }

    return stats;
  } catch (e) {
    return {
      todayDate: todayStr,
      todayCount: BASE_TODAY,
      totalCount: BASE_TOTAL,
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
        todayCount: data.todayCount ?? BASE_TODAY,
        totalCount: data.totalCount ?? BASE_TOTAL,
        lastVisit: Date.now()
      };

      if (method === 'POST') {
        sessionStorage.setItem(SESSION_KEY, 'true');
      }

      localStorage.setItem(VISITOR_KEY, JSON.stringify(newStats));
      return newStats;
    }
  } catch (err) {
    // Graceful fallback to cached stats if API is unreachable (e.g. local dev without server)
    console.debug('Visitor API offline or not yet configured, using local stats:', err.message);
  }

  return getVisitorStats();
}

