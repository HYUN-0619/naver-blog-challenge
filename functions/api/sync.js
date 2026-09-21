// Cloudflare Pages / Worker Function: /api/sync
// Handles multi-device cloud synchronization by Naver Blog ID with optional 4-digit PIN lock

async function hashPin(pin, salt = 'po3_pin_salt_2026') {
  if (!pin) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function sanitizeBlogId(input) {
  if (!input) return '';
  let id = input.trim().toLowerCase();
  id = id.replace(/^https?:\/\//i, '');
  id = id.replace(/^(m\.)?blog\.naver\.com\//i, '');
  id = id.split('?')[0].split('/')[0];
  id = id.replace(/^@/, '');
  return id.trim();
}

async function ensureTable(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_calendars (
        blog_id TEXT PRIMARY KEY,
        calendar_data TEXT NOT NULL,
        pin_hash TEXT DEFAULT NULL,
        master_token TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (e) {
    console.error('Error in ensureTable (user_calendars):', e);
  }
}

// GET /api/sync?blogId=...&token=...&pin=...
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const rawBlogId = url.searchParams.get('blogId');
  const token = url.searchParams.get('token') || '';
  const pin = url.searchParams.get('pin') || '';

  if (!rawBlogId) {
    return new Response(JSON.stringify({ success: false, error: '블로그 아이디가 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const blogId = sanitizeBlogId(rawBlogId);

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 Database not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  await ensureTable(env.DB);

  try {
    const row = await env.DB.prepare(
      'SELECT blog_id, calendar_data, pin_hash, master_token, updated_at FROM user_calendars WHERE blog_id = ?'
    ).bind(blogId).first();

    if (!row) {
      return new Response(JSON.stringify({
        success: true,
        exists: false,
        blogId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const isLocked = Boolean(row.pin_hash);

    // If locked, verify with token or PIN
    if (isLocked) {
      let isVerified = false;
      if (token && token === row.master_token) {
        isVerified = true;
      } else if (pin) {
        const inputHash = await hashPin(pin);
        if (inputHash === row.pin_hash) {
          isVerified = true;
        }
      }

      if (!isVerified) {
        return new Response(JSON.stringify({
          success: true,
          exists: true,
          blogId,
          isLocked: true,
          verified: false,
          updatedAt: row.updated_at
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // Success (unlocked or verified)
    let parsedCalendar = {};
    try {
      parsedCalendar = JSON.parse(row.calendar_data);
    } catch {}

    return new Response(JSON.stringify({
      success: true,
      exists: true,
      blogId,
      isLocked,
      verified: true,
      calendarData: parsedCalendar,
      updatedAt: row.updated_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (err) {
    console.error('Failed to get cloud calendar:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

// POST /api/sync - Save/update cloud calendar data
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 Database not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  await ensureTable(env.DB);

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const { calendarData, token, pin } = body;
  const blogId = sanitizeBlogId(body.blogId);

  if (!blogId || !calendarData) {
    return new Response(JSON.stringify({ success: false, error: '블로그 아이디와 데이터가 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const dataStr = typeof calendarData === 'string' ? calendarData : JSON.stringify(calendarData);
  const deviceToken = token || `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const existing = await env.DB.prepare(
      'SELECT blog_id, pin_hash, master_token FROM user_calendars WHERE blog_id = ?'
    ).bind(blogId).first();

    if (existing) {
      // Check lock
      if (existing.pin_hash) {
        let authorized = false;
        if (token && token === existing.master_token) {
          authorized = true;
        } else if (pin) {
          const inputHash = await hashPin(pin);
          if (inputHash === existing.pin_hash) {
            authorized = true;
          }
        }

        if (!authorized) {
          return new Response(JSON.stringify({
            success: false,
            isLocked: true,
            error: '4자리 보안 PIN이 일치하지 않습니다.'
          }), {
            status: 403,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      }

      // Update
      await env.DB.prepare(`
        UPDATE user_calendars
        SET calendar_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE blog_id = ?
      `).bind(dataStr, blogId).run();

    } else {
      // First time save for this blogId
      await env.DB.prepare(`
        INSERT INTO user_calendars (blog_id, calendar_data, master_token)
        VALUES (?, ?, ?)
      `).bind(blogId, dataStr, deviceToken).run();
    }

    return new Response(JSON.stringify({
      success: true,
      blogId,
      token: existing?.master_token || deviceToken,
      message: '클라우드에 성공적으로 동기화되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (err) {
    console.error('Failed to save cloud calendar:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

// POST /api/sync/pin - Set, update, or remove 4-digit PIN lock
export async function onPinPost(context) {
  const { request, env } = context;

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'D1 Database not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  await ensureTable(env.DB);

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const { action, pin, oldPin, token } = body; // action: 'set' | 'remove'
  const blogId = sanitizeBlogId(body.blogId);

  if (!blogId) {
    return new Response(JSON.stringify({ success: false, error: '블로그 아이디가 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const existing = await env.DB.prepare(
      'SELECT blog_id, pin_hash, master_token FROM user_calendars WHERE blog_id = ?'
    ).bind(blogId).first();

    if (!existing) {
      return new Response(JSON.stringify({ success: false, error: '동기화된 캘린더를 먼저 등록해주세요.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // If already locked, verify permission to change/remove
    if (existing.pin_hash) {
      let authorized = false;
      if (token && token === existing.master_token) {
        authorized = true;
      } else if (oldPin) {
        const oldHash = await hashPin(oldPin);
        if (oldHash === existing.pin_hash) {
          authorized = true;
        }
      }

      if (!authorized) {
        return new Response(JSON.stringify({ success: false, error: '기존 PIN 번호가 일치하지 않습니다.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    if (action === 'remove') {
      await env.DB.prepare('UPDATE user_calendars SET pin_hash = NULL WHERE blog_id = ?').bind(blogId).run();
      return new Response(JSON.stringify({
        success: true,
        isLocked: false,
        message: '보안 PIN 잠금이 해제되었습니다.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // action === 'set'
    if (!pin || !/^\d{4}$/.test(pin)) {
      return new Response(JSON.stringify({ success: false, error: 'PIN은 숫자 4자리여야 합니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const newPinHash = await hashPin(pin);
    const newToken = token || existing.master_token;

    await env.DB.prepare(
      'UPDATE user_calendars SET pin_hash = ?, master_token = ? WHERE blog_id = ?'
    ).bind(newPinHash, newToken, blogId).run();

    return new Response(JSON.stringify({
      success: true,
      isLocked: true,
      token: newToken,
      message: '4자리 보안 PIN 잠금이 설정되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (err) {
    console.error('Error in onPinPost:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
