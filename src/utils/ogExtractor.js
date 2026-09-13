/**
 * Auto-extract OpenGraph Metadata (Title & Thumbnail Image) from any URL (including Naver Blog)
 */
export async function extractOgMetadata(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.startsWith('http')) {
    return { title: null, image: null };
  }

  // Normalize Naver Blog URL to mobile version for optimal OpenGraph extraction
  let targetUrl = rawUrl.trim();
  if (targetUrl.includes('blog.naver.com')) {
    // e.g. https://blog.naver.com/PostView.naver?blogId=xyz&logNo=123
    const matchParams = targetUrl.match(/blogId=([^&]+).*?logNo=([^&]+)/);
    if (matchParams) {
      targetUrl = `https://m.blog.naver.com/${matchParams[1]}/${matchParams[2]}`;
    } else {
      // e.g. https://blog.naver.com/xyz/123
      const matchPath = targetUrl.match(/blog\.naver\.com\/([^/]+)\/(\d+)/);
      if (matchPath) {
        targetUrl = `https://m.blog.naver.com/${matchPath[1]}/${matchPath[2]}`;
      }
    }
  }

  try {
    // 1. Primary: MicroLink OpenGraph Free API
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        let title = json.data.title || null;
        let image = json.data.image?.url || null;
        
        if (title) {
          title = title.replace(/\s*:\s*네이버\s*블로그/g, '').trim();
        }

        if (title || image) {
          return { title, image };
        }
      }
    }
  } catch (err) {
    console.warn('MicroLink API fetch failed, trying fallback...', err);
  }

  try {
    // 2. Fallback: AllOrigins CORS proxy + Regex HTML parsing
    const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
    if (proxyRes.ok) {
      const proxyJson = await proxyRes.json();
      const html = proxyJson.contents || '';
      
      // Parse og:image
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
      const image = ogImageMatch ? ogImageMatch[1] : null;

      // Parse og:title
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i) ||
                           html.match(/<title>([^<]+)<\/title>/i);
      let title = ogTitleMatch ? ogTitleMatch[1] : null;
      if (title) {
        title = title.replace(/\s*:\s*네이버\s*블로그/g, '').trim();
      }

      return { title, image };
    }
  } catch (err) {
    console.error('Failed to extract OG metadata:', err);
  }

  return { title: null, image: null };
}
