// Utility to generate formatted verification text & HTML for Naver Blog & SNS copy

/**
 * Generates formatted text & HTML for daily 1-day 3-posts challenge certification
 */
export function generateVerificationTemplates({ 
  dateStr, 
  posts = [], 
  streak = 0, 
  progressPercent = null, 
  totalCompleted = null 
}) {
  const completedPosts = posts.filter(p => p.completed || p.title?.trim());
  const displayPosts = completedPosts.length > 0 ? completedPosts : posts.slice(0, 3);

  // 1. Plain Text Format (Ideal for KakaoTalk, Cafes, Telegram, Text Editors)
  let text = `🏆 [po3.site] ${dateStr} 네이버 블로그 1일 3포 완주 인증! 🔥\n\n`;

  displayPosts.forEach((p, idx) => {
    const numIcon = idx === 0 ? '1️⃣' : idx === 1 ? '2️⃣' : idx === 2 ? '3️⃣' : `[${idx + 1}포]`;
    const cat = p.category ? `[${p.category}] ` : '';
    const title = p.title?.trim() || `포스팅 ${idx + 1} 발행 완료`;
    text += `${numIcon} ${cat}${title}\n`;
    if (p.url && p.url.trim()) {
      text += `🔗 ${p.url.trim()}\n`;
    }
    text += '\n';
  });

  if (streak && streak > 0) {
    text += `✨ 현재 ${streak}일 연속 달성 중! 🏃‍♂️\n`;
  }
  if (progressPercent) {
    text += `📊 이번 달 목표 진행률: ${progressPercent}%\n`;
  }

  text += `함께 달리는 1일 3포 캘린더 👉 https://po3.site`;

  // 2. Rich HTML Format (Pasting into Naver SmartEditor creates styled cards & hyperlinks)
  let html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif; line-height: 1.6; color: #222;">
  <p style="font-size: 16px; font-weight: bold; color: #03C75A; margin-bottom: 12px;">
    🏆 <strong>[po3.site] ${dateStr} 네이버 블로그 1일 3포 완주 인증! 🔥</strong>
  </p>
  <div style="background: #f8f9fa; border-left: 4px solid #03C75A; padding: 14px 18px; border-radius: 6px; margin-bottom: 14px;">
`;

  displayPosts.forEach((p, idx) => {
    const cat = p.category ? `<span style="color: #03C75A; font-weight: bold;">[${p.category}]</span> ` : '';
    const title = p.title?.trim() || `포스팅 ${idx + 1} 발행 완료`;
    const link = p.url && p.url.trim() ? `<br><a href="${p.url.trim()}" target="_blank" style="color: #2196F3; font-size: 13px; text-decoration: underline;">🔗 ${p.url.trim()}</a>` : '';

    html += `
    <p style="margin: 8px 0; font-size: 14px;">
      <strong>${idx + 1}포:</strong> ${cat}${title}${link}
    </p>
`;
  });

  html += `
  </div>
`;

  if (streak && streak > 0) {
    html += `<p style="font-size: 14px; margin: 6px 0;">✨ <strong>현재 ${streak}일 연속 달성 중! 🏃‍♂️</strong></p>`;
  }

  html += `
  <p style="font-size: 13px; color: #666; margin-top: 10px;">
    함께 달리는 1일 3포 캘린더 👉 <a href="https://po3.site" target="_blank" style="color: #03C75A; font-weight: bold; text-decoration: none;">https://po3.site</a>
  </p>
</div>
`;

  return { text, html };
}

/**
 * Copies formatted text and rich HTML to clipboard
 */
export async function copyFormattedVerification({ text, html }) {
  if (navigator?.clipboard?.write && window.ClipboardItem) {
    try {
      const blobText = new Blob([text], { type: 'text/plain' });
      const blobHtml = new Blob([html], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': blobText,
          'text/html': blobHtml
        })
      ]);
      return true;
    } catch (e) {
      console.warn('ClipboardItem write failed, falling back to writeText:', e);
    }
  }

  // Fallback to plain text
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  // Fallback for older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return true;
}
