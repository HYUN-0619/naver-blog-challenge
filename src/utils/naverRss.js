// Frontend Utility for Naver Blog RSS Integration

const STORAGE_KEY = 'po3_naver_blog_id';

/**
 * Sanitize Naver Blog ID from user input or pasted URL
 * e.g. "https://blog.naver.com/my_id?tab=1" -> "my_id"
 */
export function sanitizeNaverId(input) {
  if (!input) return '';
  let id = input.trim();
  id = id.replace(/^https?:\/\//i, '');
  id = id.replace(/^(m\.)?blog\.naver\.com\//i, '');
  id = id.split('?')[0].split('/')[0];
  id = id.replace(/^@/, '');
  return id.trim();
}

/**
 * Get saved Naver Blog ID from localStorage
 */
export function getSavedNaverBlogId() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Save Naver Blog ID to localStorage
 */
export function saveNaverBlogId(blogId) {
  try {
    const clean = sanitizeNaverId(blogId);
    if (clean) {
      localStorage.setItem(STORAGE_KEY, clean);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return clean;
  } catch {
    return blogId;
  }
}

/**
 * Fetch parsed Naver Blog RSS posts from backend API
 */
export async function fetchNaverBlogRss(blogId) {
  const cleanId = sanitizeNaverId(blogId);
  if (!cleanId) {
    return { success: false, error: '네이버 블로그 아이디를 입력해주세요.' };
  }

  try {
    const res = await fetch(`/api/naver-rss?blogId=${encodeURIComponent(cleanId)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch Naver RSS:', err);
    return {
      success: false,
      error: '네이버 블로그 정보를 불러오는 중 네트워크 오류가 발생했습니다.'
    };
  }
}

/**
 * Maps RSS items to challenge days data structure
 * @param {Array} rssItems - Parsed items from /api/naver-rss
 * @param {Object} currentChallengeData - Existing challenge data from state/storage
 * @param {string|null} targetDateKey - Optional specific dateKey (e.g. '2026-09-18') or null for all month
 */
export function applyRssPostsToChallengeData(rssItems, currentChallengeData, targetDateKey = null) {
  if (!rssItems || !Array.isArray(rssItems) || rssItems.length === 0) {
    return {
      updatedData: currentChallengeData,
      syncedPostsCount: 0,
      syncedDaysCount: 0,
      affectedDates: []
    };
  }

  // Filter items
  const validItems = targetDateKey
    ? rssItems.filter(item => item.dateKey === targetDateKey)
    : rssItems.filter(item => Boolean(item.dateKey));

  // Group items by dateKey
  const itemsByDate = {};
  validItems.forEach(item => {
    if (!itemsByDate[item.dateKey]) {
      itemsByDate[item.dateKey] = [];
    }
    itemsByDate[item.dateKey].push(item);
  });

  const updatedData = { ...currentChallengeData };
  let syncedPostsCount = 0;
  const affectedDates = [];

  Object.entries(itemsByDate).forEach(([dateKey, items]) => {
    // Sort chronological: oldest first for post 1, 2, 3
    items.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const existingDay = updatedData[dateKey];
    const existingPosts = existingDay?.posts ? JSON.parse(JSON.stringify(existingDay.posts)) : [
      { id: 1, completed: false, title: '', category: '일상', url: '', image: '', note: '' },
      { id: 2, completed: false, title: '', category: '일상', url: '', image: '', note: '' },
      { id: 3, completed: false, title: '', category: '일상', url: '', image: '', note: '' }
    ];

    // Merge RSS items into posts
    items.forEach((item, idx) => {
      syncedPostsCount++;
      if (idx < existingPosts.length) {
        existingPosts[idx] = {
          ...existingPosts[idx],
          completed: true,
          title: item.title,
          url: item.link,
          category: item.category || existingPosts[idx].category || '일상',
          note: existingPosts[idx].note || `네이버 블로그 자동 연동 (${item.time || ''})`
        };
      } else {
        // If more than existing slots (e.g. 4th post)
        existingPosts.push({
          id: Date.now() + idx,
          completed: true,
          title: item.title,
          url: item.link,
          category: item.category || '일상',
          image: '',
          note: `네이버 블로그 추가 포스팅 (${item.time || ''})`
        });
      }
    });

    updatedData[dateKey] = {
      date: dateKey,
      posts: existingPosts
    };
    affectedDates.push(dateKey);
  });

  return {
    updatedData,
    syncedPostsCount,
    syncedDaysCount: affectedDates.length,
    affectedDates
  };
}
