// Cloudflare Pages Function: /api/visit
// Handles visitor logging and real-time statistics via Cloudflare D1

const BASE_TODAY = 142;
const BASE_TOTAL = 3480;

// Helper: Hash IP to protect user privacy (SHA-256)
async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + '_naver_blog_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// Helper: Get Current KST (UTC+9) Date String (YYYY-MM-DD)
function getKstDateStr() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

// Helper: Query Visitor Counts
async function getCounts(db, dateStr) {
  try {
    const todayResult = await db.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM visitor_logs WHERE date_str = ?'
    ).bind(dateStr).first();

    const totalResult = await db.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM visitor_logs'
    ).first();

    const realToday = Number(todayResult?.count || 0);
    const realTotal = Number(totalResult?.count || 0);

    return {
      todayCount: BASE_TODAY + realToday,
      totalCount: BASE_TOTAL + realTotal,
      realToday,
      realTotal
    };
  } catch (e) {
    console.error('D1 query error:', e);
    return {
      todayCount: BASE_TODAY,
      totalCount: BASE_TOTAL,
      realToday: 0,
      realTotal: 0
    };
  }
}

// GET /api/visit - Fetch current stats without logging
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const dateStr = getKstDateStr();

  // If ?details=true and DB exists, return summary breakdown
  if (url.searchParams.get('details') === 'true' && env?.DB) {
    try {
      const topReferrers = await env.DB.prepare(
        'SELECT referrer, COUNT(*) as count FROM visitor_logs WHERE referrer IS NOT NULL AND referrer != "" GROUP BY referrer ORDER BY count DESC LIMIT 10'
      ).all();

      const recentLogs = await env.DB.prepare(
        'SELECT country, city, referrer, path, created_at FROM visitor_logs ORDER BY id DESC LIMIT 20'
      ).all();

      const counts = await getCounts(env.DB, dateStr);

      return new Response(JSON.stringify({
        success: true,
        counts,
        topReferrers: topReferrers.results || [],
        recentLogs: recentLogs.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (!env?.DB) {
    return new Response(JSON.stringify({
      success: true,
      fallback: true,
      todayCount: BASE_TODAY,
      totalCount: BASE_TOTAL
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const counts = await getCounts(env.DB, dateStr);
  return new Response(JSON.stringify({
    success: true,
    ...counts
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST /api/visit - Record visit & return real-time stats
export async function onRequestPost(context) {
  const { request, env } = context;
  const dateStr = getKstDateStr();

  let body = {};
  try {
    body = await request.json();
  } catch {
    // empty body allowed
  }

  if (!env?.DB) {
    return new Response(JSON.stringify({
      success: true,
      fallback: true,
      todayCount: BASE_TODAY,
      totalCount: BASE_TOTAL
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 1. Extract visitor information
    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = await hashIp(clientIp);
    const userAgent = (request.headers.get('user-agent') || '').slice(0, 255);
    const country = request.cf?.country || '';
    const city = request.cf?.city || '';
    const referrer = (body.referrer || request.headers.get('referer') || '').slice(0, 500);
    const path = (body.path || '/').slice(0, 100);

    // 2. Insert visit log
    await env.DB.prepare(
      'INSERT INTO visitor_logs (ip_hash, user_agent, referrer, country, city, path, date_str) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(ipHash, userAgent, referrer, country, city, path, dateStr).run();

    // 3. Get updated counts
    const counts = await getCounts(env.DB, dateStr);

    return new Response(JSON.stringify({
      success: true,
      ...counts
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to log visit:', e);
    const fallbackCounts = await getCounts(env.DB, dateStr);
    return new Response(JSON.stringify({
      success: false,
      error: e.message,
      ...fallbackCounts
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
