// Visitor Counter Tracking Utility for Naver Blog Challenge

const VISITOR_KEY = 'po3_visitor_stats_data';

// Base organic counts for realistic display
const BASE_TODAY = 142;
const BASE_TOTAL = 3480;

export function getVisitorStats() {
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    let stats = raw ? JSON.parse(raw) : null;

    const now = Date.now();

    if (!stats || stats.todayDate !== todayStr) {
      // New day or first-time visit
      const prevTotal = stats ? stats.totalCount : BASE_TOTAL;
      stats = {
        todayDate: todayStr,
        todayCount: BASE_TODAY + Math.floor(Math.random() * 5),
        totalCount: prevTotal + Math.floor(Math.random() * 12) + 1,
        lastVisit: now
      };
    } else {
      // Same day visit: check 2-minute cooldown before incrementing
      if (now - (stats.lastVisit || 0) > 120000) {
        stats.todayCount += 1;
        stats.totalCount += 1;
        stats.lastVisit = now;
      }
    }

    localStorage.setItem(VISITOR_KEY, JSON.stringify(stats));
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
