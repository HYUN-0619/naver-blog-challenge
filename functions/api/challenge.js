// Cloudflare Pages Function: /api/challenge
// Handles real-time global challenger activity tracking and live completion feed

function getKstDateStr() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

const SEED_ACTIVITIES = [
  {
    event_type: 'post_completed',
    post_number: 1,
    post_title: '출근길 아침 1포 발행 완료! IT 꿀팁',
    category: 'IT',
    nickname: '새벽블로거'
  },
  {
    event_type: 'post_completed',
    post_number: 2,
    post_title: '점심시간 짬내서 2포 맛집 후기 작성',
    category: '맛집',
    nickname: '성수동러너'
  },
  {
    event_type: 'day_finished',
    post_number: 3,
    post_title: '오늘 1일 3포 목표 완주 성공 도장 쾅! 🔥',
    category: '일상',
    nickname: '갓생챌린저'
  }
];

async function ensureChallengeTable(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS challenge_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        post_number INTEGER,
        post_title TEXT,
        category TEXT,
        nickname TEXT DEFAULT '익명의 러너',
        date_str TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare('CREATE INDEX IF NOT EXISTS idx_challenge_date ON challenge_events(date_str)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_challenge_type ON challenge_events(event_type)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_challenge_created ON challenge_events(created_at DESC)').run();

    const countCheck = await db.prepare('SELECT COUNT(*) as count FROM challenge_events').first();
    if (Number(countCheck?.count || 0) === 0) {
      const todayStr = getKstDateStr();
      for (const seed of SEED_ACTIVITIES) {
        await db.prepare(`
          INSERT INTO challenge_events (event_type, post_number, post_title, category, nickname, date_str)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(seed.event_type, seed.post_number, seed.post_title, seed.category, seed.nickname, todayStr).run();
      }
    }
  } catch (e) {
    console.error('Error in ensureChallengeTable:', e);
  }
}

async function getChallengeStats(db, dateStr) {
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

    const recentRes = await db.prepare(
      'SELECT id, event_type, post_number, post_title, category, nickname, created_at FROM challenge_events ORDER BY id DESC LIMIT 10'
    ).all();

    return {
      todayPosts: Number(todayPostsRes?.count || 0),
      todayFinishers: Number(todayFinishersRes?.count || 0),
      totalPosts: Number(totalPostsRes?.count || 0),
      recentEvents: recentRes.results || []
    };
  } catch (e) {
    console.error('Failed to get challenge stats:', e);
    return {
      todayPosts: 0,
      todayFinishers: 0,
      totalPosts: 0,
      recentEvents: []
    };
  }
}

// GET /api/challenge - Fetch global activity counts & live ticker
export async function onRequestGet(context) {
  const { env } = context;
  const dateStr = getKstDateStr();

  if (!env?.DB) {
    return new Response(JSON.stringify({
      success: true,
      todayPosts: 12,
      todayFinishers: 3,
      totalPosts: 45,
      recentEvents: SEED_ACTIVITIES.map((s, i) => ({ id: i, ...s, created_at: new Date().toISOString() })),
      fallback: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await ensureChallengeTable(env.DB);
  const stats = await getChallengeStats(env.DB, dateStr);

  return new Response(JSON.stringify({
    success: true,
    ...stats
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST /api/challenge - Record a completed post or day finish event
export async function onRequestPost(context) {
  const { request, env } = context;
  const dateStr = getKstDateStr();

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'DB not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await ensureChallengeTable(env.DB);

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const eventType = body.eventType === 'day_finished' ? 'day_finished' : 'post_completed';
  const postNumber = Number(body.postNumber || 1);
  const postTitle = (body.postTitle || '').slice(0, 100);
  const category = (body.category || '일상').slice(0, 30);
  const nickname = (body.nickname || '익명의 러너').slice(0, 30);

  try {
    await env.DB.prepare(`
      INSERT INTO challenge_events (event_type, post_number, post_title, category, nickname, date_str)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(eventType, postNumber, postTitle, category, nickname, dateStr).run();

    const stats = await getChallengeStats(env.DB, dateStr);

    return new Response(JSON.stringify({
      success: true,
      ...stats
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to insert challenge event:', e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
