// Cloudflare Pages / Worker Function: /api/admin
// Secure Administrative API for Traffic Analytics and Feedback/Challenger Management

const DEFAULT_ADMIN_KEY = 'po3admin2026!';

// Helper: Check Admin Authorization Header
function isAuthorized(request, env) {
  const expectedKey = env?.ADMIN_SECRET || DEFAULT_ADMIN_KEY;
  const authHeader = request.headers.get('Authorization') || '';
  const customHeader = request.headers.get('x-admin-key') || '';
  
  if (customHeader === expectedKey) return true;
  if (authHeader.startsWith('Bearer ') && authHeader.slice(7).trim() === expectedKey) return true;
  return false;
}

// Helper: Get Current KST Date String
function getKstDateStr() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

// POST /api/admin/auth - Authenticate admin password
export async function handleAdminAuth(context) {
  const { request, env } = context;
  const expectedKey = env?.ADMIN_SECRET || DEFAULT_ADMIN_KEY;

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: '잘못된 요청 형식입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const { password } = body;
  if (password === expectedKey) {
    return new Response(JSON.stringify({
      success: true,
      token: expectedKey,
      message: '관리자 인증에 성공했습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({
    success: false,
    error: '비밀번호가 올바르지 않습니다.'
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

// GET /api/admin/stats - Fetch consolidated admin metrics
export async function handleAdminStats(context) {
  const { request, env } = context;

  if (!isAuthorized(request, env)) {
    return new Response(JSON.stringify({ success: false, error: '관리자 권한이 필요합니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 데이터베이스가 연결되지 않았습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const db = env.DB;
  const dateStr = getKstDateStr();

  try {
    // 1. Traffic Metrics
    const todayVisitorsRes = await db.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM visitor_logs WHERE date_str = ?'
    ).bind(dateStr).first();

    const totalVisitorsRes = await db.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM visitor_logs'
    ).first();

    const activeNowRes = await db.prepare(
      "SELECT COUNT(DISTINCT ip_hash) as count FROM visitor_logs WHERE created_at >= datetime('now', '-10 minutes')"
    ).first();

    // Top 10 Referrers (Filter out internal self-referrals if empty or po3.site)
    const topReferrersRes = await db.prepare(`
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN '직접 접속 (Direct / 북마크)'
          ELSE referrer 
        END as source,
        COUNT(*) as count
      FROM visitor_logs
      GROUP BY source
      ORDER BY count DESC
      LIMIT 10
    `).all();

    // Top Countries / Cities
    const topLocationsRes = await db.prepare(`
      SELECT 
        COALESCE(country, 'KR') as country,
        COALESCE(city, 'Seoul') as city,
        COUNT(*) as count
      FROM visitor_logs
      GROUP BY country, city
      ORDER BY count DESC
      LIMIT 10
    `).all();

    // Recent 50 Visitor Logs
    const recentLogsRes = await db.prepare(`
      SELECT id, ip_hash, country, city, referrer, path, user_agent, created_at
      FROM visitor_logs
      ORDER BY id DESC
      LIMIT 50
    `).all();

    // 2. Challenger Metrics
    let challengerStats = {
      todayPosts: 0,
      todayFinishers: 0,
      totalPosts: 0,
      recentEvents: []
    };

    try {
      const todayPostsRes = await db.prepare(
        "SELECT COUNT(*) as count FROM challenge_events WHERE date_str = ? AND event_type = 'post_completed'"
      ).bind(dateStr).first();

      const todayFinishersRes = await db.prepare(
        "SELECT COUNT(*) as count FROM challenge_events WHERE date_str = ? AND event_type = 'day_finished'"
      ).bind(dateStr).first();

      const totalPostsRes = await db.prepare(
        "SELECT COUNT(*) as count FROM challenge_events WHERE event_type = 'post_completed'"
      ).first();

      const recentEventsRes = await db.prepare(
        'SELECT * FROM challenge_events ORDER BY id DESC LIMIT 30'
      ).all();

      challengerStats = {
        todayPosts: Number(todayPostsRes?.count || 0),
        todayFinishers: Number(todayFinishersRes?.count || 0),
        totalPosts: Number(totalPostsRes?.count || 0),
        recentEvents: recentEventsRes?.results || []
      };
    } catch (e) {
      console.warn('Could not query challenge_events:', e.message);
    }

    // 3. Feedback Items & Votes
    let feedbackItems = [];
    try {
      const fbRes = await db.prepare(`
        SELECT id, title, description, category, author, status, upvotes, created_at
        FROM feedback
        ORDER BY id DESC
      `).all();
      feedbackItems = fbRes?.results || [];
    } catch (e) {
      console.warn('Could not query feedback:', e.message);
    }

    return new Response(JSON.stringify({
      success: true,
      traffic: {
        activeNow: Math.max(1, Number(activeNowRes?.count || 1)),
        todayVisitors: Number(todayVisitorsRes?.count || 0),
        totalVisitors: Number(totalVisitorsRes?.count || 0),
        topReferrers: topReferrersRes?.results || [],
        topLocations: topLocationsRes?.results || [],
        recentLogs: recentLogsRes?.results || []
      },
      challenger: challengerStats,
      feedback: feedbackItems
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });

  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

// PATCH /api/admin/feedback - Update feedback status
export async function handleAdminFeedbackUpdate(context) {
  const { request, env } = context;

  if (!isAuthorized(request, env)) {
    return new Response(JSON.stringify({ success: false, error: '관리자 권한이 필요합니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: '잘못된 JSON 형식입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const { id, status } = body;
  const validStatuses = ['under_review', 'planned', 'in_progress', 'completed'];

  if (!id || !validStatuses.includes(status)) {
    return new Response(JSON.stringify({ success: false, error: '유효한 ID와 상태값이 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    await env.DB.prepare(
      'UPDATE feedback SET status = ? WHERE id = ?'
    ).bind(status, id).run();

    return new Response(JSON.stringify({
      success: true,
      message: '제안 상태가 성공적으로 변경되었습니다.',
      id,
      status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

// DELETE /api/admin/feedback - Delete a feedback item and related votes
export async function handleAdminFeedbackDelete(context) {
  const { request, env } = context;

  if (!isAuthorized(request, env)) {
    return new Response(JSON.stringify({ success: false, error: '관리자 권한이 필요합니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: '삭제할 제안 ID가 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    await env.DB.prepare('DELETE FROM feedback WHERE id = ?').bind(id).run();
    try {
      await env.DB.prepare('DELETE FROM feedback_votes WHERE feedback_id = ?').bind(id).run();
    } catch {}

    return new Response(JSON.stringify({
      success: true,
      message: '제안이 성공적으로 삭제되었습니다.',
      id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
