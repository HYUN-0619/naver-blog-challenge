/**
 * Auto-extract OpenGraph Metadata (Title & Thumbnail Image) from any URL (including Naver Blog)
 */
export async function extractOgMetadata(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return { title: null, image: null };
  }

  try {
    // 1. Primary: MicroLink OpenGraph Free API
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const title = json.data.title || null;
        const image = json.data.image?.url || null;
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
    const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
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
        title = title.replace(/\s*:\s*네이버 블로그/g, '').trim();
      }

      return { title, image };
    }
  } catch (err) {
    console.error('Failed to extract OG metadata:', err);
  }

  return { title: null, image: null };
}
