// Cloudflare Pages Function: /api/feedback/vote
// Handles toggling upvotes for feedback items

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env?.DB) {
    return new Response(JSON.stringify({ success: false, error: 'DB not connected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const feedbackId = Number(body.feedbackId);
  const voterToken = (body.voterToken || '').trim();

  if (!feedbackId || !voterToken) {
    return new Response(JSON.stringify({ success: false, error: 'Missing feedbackId or voterToken' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check if user has already voted
    const existingVote = await env.DB.prepare(
      'SELECT id FROM feedback_votes WHERE feedback_id = ? AND voter_token = ?'
    ).bind(feedbackId, voterToken).first();

    let hasVoted = false;

    if (existingVote) {
      // Unvote: remove vote record and decrease upvotes
      await env.DB.prepare(
        'DELETE FROM feedback_votes WHERE feedback_id = ? AND voter_token = ?'
      ).bind(feedbackId, voterToken).run();

      await env.DB.prepare(
        'UPDATE feedback SET upvotes = MAX(0, upvotes - 1) WHERE id = ?'
      ).bind(feedbackId).run();

      hasVoted = false;
    } else {
      // Upvote: insert vote record and increment upvotes
      await env.DB.prepare(
        'INSERT INTO feedback_votes (feedback_id, voter_token) VALUES (?, ?)'
      ).bind(feedbackId, voterToken).run();

      await env.DB.prepare(
        'UPDATE feedback SET upvotes = upvotes + 1 WHERE id = ?'
      ).bind(feedbackId).run();

      hasVoted = true;
    }

    // Return latest upvotes count
    const updated = await env.DB.prepare('SELECT upvotes FROM feedback WHERE id = ?').bind(feedbackId).first();
    const upvotes = updated?.upvotes ?? 0;

    return new Response(JSON.stringify({
      success: true,
      feedbackId,
      hasVoted,
      upvotes
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Failed to toggle vote:', e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
