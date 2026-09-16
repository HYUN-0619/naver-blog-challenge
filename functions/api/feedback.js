// Cloudflare Pages Function: /api/feedback
// Handles listing, creation, and auto-initialization for the Feedback & Upvoting Board

// Seed sample data for high user engagement on launch
const SEED_FEEDBACK = [
  {
    title: '📱 스마트폰 홈 화면 바로가기 위젯 (PWA 지원)',
    description: '모바일 브라우저에서 홈 화면에 추가했을 때 앱처럼 전체화면으로 열리고, 매일 손쉽게 3포 체크를 할 수 있으면 좋겠습니다!',
    category: 'feature',
    status: 'in_progress',
    author: '갓생러너',
    upvotes: 38
  },
  {
    title: '🌐 티스토리 & 워드프레스용 챌린지 모드 지원',
    description: '네이버 블로그뿐만 아니라 티스토리나 워드프레스 블로그 운영자도 1일 3포 목표를 달성할 수 있도록 다중 블로그 탭을 열어주세요.',
    category: 'feature',
    status: 'under_review',
    author: '수익형블로거',
    upvotes: 24
  },
  {
    title: '📋 당일 3포 제목+링크 원클릭 블로그 포스팅 양식 복사',
    description: '오늘 쓴 1포, 2포, 3포 글 제목과 URL을 네이버 스마트에디터에 바로 붙여넣기 좋은 서식으로 클립보드에 복사해 주는 버튼이 있으면 인증글 쓰기가 훨씬 편할 것 같습니다.',
    category: 'improvement',
    status: 'planned',
    author: 'N잡마스터',
    upvotes: 19
  },
  {
    title: '⚡ 캡처 썸네일 첨부 이미지 초고속 압축 최적화',
    description: '고화질 스마트폰 캡처 이미지를 올려도 캘린더 로딩이 버벅거리지 않도록 브라우저에서 용량을 자동 리사이징 최적화해 주세요.',
    category: 'improvement',
    status: 'completed',
    author: '초보블로거',
    upvotes: 15
  }
];

// Helper: Ensure D1 tables and seed data exist
async function ensureTables(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'feature',
        author TEXT DEFAULT '익명의 블로거',
        status TEXT DEFAULT 'under_review',
        upvotes INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS feedback_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback_id INTEGER NOT NULL,
        voter_token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(feedback_id, voter_token)
      )
    `).run();

    // Check if table is empty, if so populate seeds
    const countCheck = await db.prepare('SELECT COUNT(*) as count FROM feedback').first();
    if (Number(countCheck?.count || 0) === 0) {
      for (const seed of SEED_FEEDBACK) {
        await db.prepare(`
          INSERT INTO feedback (title, description, category, author, status, upvotes)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(seed.title, seed.description, seed.category, seed.author, seed.status, seed.upvotes).run();
      }
    }
  } catch (e) {
    console.error('Error in ensureTables:', e);
  }
}

// GET /api/feedback - List feedback items
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: true, items: SEED_FEEDBACK, fallback: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await ensureTables(env.DB);

  const status = url.searchParams.get('status') || 'all';
  const category = url.searchParams.get('category') || 'all';
  const sort = url.searchParams.get('sort') || 'popular'; // 'popular' or 'latest'
  const voterToken = url.searchParams.get('voterToken') || '';

  let query = 'SELECT * FROM feedback WHERE 1=1';
  const bindings = [];

  if (status !== 'all') {
    query += ' AND status = ?';
    bindings.push(status);
  }

  if (category !== 'all') {
    query += ' AND category = ?';
    bindings.push(category);
  }

  if (sort === 'latest') {
    query += ' ORDER BY created_at DESC, id DESC';
  } else {
    query += ' ORDER BY upvotes DESC, id DESC';
  }

  query += ' LIMIT 100';

  try {
    const result = await env.DB.prepare(query).bind(...bindings).all();
    const items = result.results || [];

    // If voterToken is provided, check which items the user has voted for
    let userVotedIds = new Set();
    if (voterToken && items.length > 0) {
      const votesResult = await env.DB.prepare(
        'SELECT feedback_id FROM feedback_votes WHERE voter_token = ?'
      ).bind(voterToken).all();

      if (votesResult?.results) {
        userVotedIds = new Set(votesResult.results.map(r => r.feedback_id));
      }
    }

    const itemsWithVoteFlag = items.map(item => ({
      ...item,
      hasVoted: userVotedIds.has(item.id)
    }));

    return new Response(JSON.stringify({
      success: true,
      items: itemsWithVoteFlag
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to query feedback:', e);
    return new Response(JSON.stringify({ success: false, error: e.message, items: SEED_FEEDBACK }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/feedback - Create new feedback
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'DB not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await ensureTables(env.DB);

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const title = (body.title || '').trim();
  const description = (body.description || '').trim();
  const category = body.category || 'feature';
  const author = (body.author || '').trim() || '익명의 블로거';
  const voterToken = (body.voterToken || '').trim();

  if (!title || title.length < 2) {
    return new Response(JSON.stringify({ success: false, error: '제목은 최소 2글자 이상 입력해 주세요.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const insertRes = await env.DB.prepare(`
      INSERT INTO feedback (title, description, category, author, status, upvotes)
      VALUES (?, ?, ?, ?, 'under_review', 1)
    `).bind(title, description, category, author).run();

    const newId = insertRes.meta.last_row_id;

    // Record author's initial vote if voterToken is provided
    if (voterToken && newId) {
      try {
        await env.DB.prepare(`
          INSERT INTO feedback_votes (feedback_id, voter_token)
          VALUES (?, ?)
        `).bind(newId, voterToken).run();
      } catch (voteErr) {
        console.warn('Initial vote insert warning:', voteErr);
      }
    }

    const created = await env.DB.prepare('SELECT * FROM feedback WHERE id = ?').bind(newId).first();

    return new Response(JSON.stringify({
      success: true,
      item: { ...created, hasVoted: true }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to create feedback:', e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
