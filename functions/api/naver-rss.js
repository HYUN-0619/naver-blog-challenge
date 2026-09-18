// Cloudflare Pages / Worker Function: /api/naver-rss
// Proxies and parses Naver Blog RSS feed into clean JSON for 1-click challenge sync

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©');
}

function sanitizeBlogId(input) {
  if (!input) return '';
  let id = input.trim();
  // Remove URL prefixes if user pasted a full URL
  id = id.replace(/^https?:\/\//i, '');
  id = id.replace(/^(m\.)?blog\.naver\.com\//i, '');
  // Remove query params or trailing paths
  id = id.split('?')[0].split('/')[0];
  // Remove @ prefix
  id = id.replace(/^@/, '');
  return id.trim();
}

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const rawBlogId = url.searchParams.get('blogId');

  if (!rawBlogId) {
    return new Response(JSON.stringify({
      success: false,
      error: '네이버 블로그 아이디를 입력해주세요.'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const blogId = sanitizeBlogId(rawBlogId);

  if (!/^[a-zA-Z0-9_-]{3,50}$/.test(blogId)) {
    return new Response(JSON.stringify({
      success: false,
      error: '유효한 네이버 아이디 형식이 아닙니다.'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`;

  try {
    const rssRes = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*'
      },
      redirect: 'follow'
    });

    if (!rssRes.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: `네이버 블로그(${blogId})의 RSS를 찾을 수 없거나 비공개 상태입니다.`
      }), {
        status: rssRes.status === 404 ? 404 : 502,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const xml = await rssRes.text();

    if (!xml.includes('<rss') && !xml.includes('<channel>')) {
      return new Response(JSON.stringify({
        success: false,
        error: '유효한 네이버 블로그 RSS 피드가 아닙니다.'
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Extract channel title
    const chTitleMatch = xml.match(/<channel>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
                         xml.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/i);
    const channelTitle = chTitleMatch ? decodeHtmlEntities(chTitleMatch[1].trim()) : `${blogId}님의 블로그`;

    // Extract channel link
    const chLinkMatch = xml.match(/<channel>[\s\S]*?<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ||
                        xml.match(/<channel>[\s\S]*?<link>([\s\S]*?)<\/link>/i);
    const channelLink = chLinkMatch ? chLinkMatch[1].trim().split('?')[0] : `https://blog.naver.com/${blogId}`;

    // Extract channel image
    const chImgMatch = xml.match(/<image>[\s\S]*?<url><!\[CDATA\[([\s\S]*?)\]\]><\/url>/i) ||
                       xml.match(/<image>[\s\S]*?<url>([\s\S]*?)<\/url>/i);
    const channelImage = chImgMatch ? chImgMatch[1].trim() : null;

    // Parse items
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    const items = [];

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];

      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
                         itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ||
                        itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const catMatch = itemXml.match(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/i) ||
                       itemXml.match(/<category>([\s\S]*?)<\/category>/i);

      const rawTitle = titleMatch ? titleMatch[1].trim() : '';
      const rawLink = linkMatch ? linkMatch[1].trim() : '';
      const rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      const rawCategory = catMatch ? catMatch[1].trim() : '';

      const cleanLink = rawLink.split('?')[0];

      const dateObj = new Date(rawPubDate);
      let dateKey = '';
      let timeStr = '';

      if (!isNaN(dateObj.getTime())) {
        const kstDate = new Date(dateObj.getTime() + 9 * 60 * 60 * 1000);
        const yyyy = kstDate.getUTCFullYear();
        const mm = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(kstDate.getUTCDate()).padStart(2, '0');
        const hh = String(kstDate.getUTCHours()).padStart(2, '0');
        const min = String(kstDate.getUTCMinutes()).padStart(2, '0');
        dateKey = `${yyyy}-${mm}-${dd}`;
        timeStr = `${hh}:${min}`;
      }

      items.push({
        title: decodeHtmlEntities(rawTitle),
        link: cleanLink,
        category: decodeHtmlEntities(rawCategory) || '일상',
        pubDate: rawPubDate,
        dateKey,
        time: timeStr,
        timestamp: !isNaN(dateObj.getTime()) ? dateObj.getTime() : null
      });
    }

    return new Response(JSON.stringify({
      success: true,
      blogId,
      channelTitle,
      channelLink,
      channelImage,
      totalCount: items.length,
      items
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (err) {
    console.error('Error in naver-rss API:', err);
    return new Response(JSON.stringify({
      success: false,
      error: '네이버 블로그 RSS 요청 중 서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
