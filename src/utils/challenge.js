// Global Challenger Real-time Activity API Utility

export async function fetchGlobalChallengeStats() {
  try {
    const res = await fetch('/api/challenge');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.debug('Failed to fetch challenge stats:', err.message);
    return null;
  }
}

export async function recordChallengeEvent({ eventType, postNumber, postTitle, category, nickname }) {
  try {
    const res = await fetch('/api/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: eventType || 'post_completed',
        postNumber: postNumber || 1,
        postTitle: postTitle || '',
        category: category || '일상',
        nickname: nickname || '익명의 러너'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.debug('Failed to record challenge event:', err.message);
    return null;
  }
}
