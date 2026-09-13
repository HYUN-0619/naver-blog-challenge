import React, { useEffect } from 'react';

export default function AdContainer({ slot = 'auto', format = 'auto', style = {}, label = '스폰서 광고' }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense load error:', e);
    }
  }, []);

  return (
    <div style={{
      margin: '24px 0',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      minHeight: '90px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...style
    }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
        {label}
      </span>
      
      {/* AdSense ins Tag Placeholder */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', minHeight: '60px' }}
           data-ad-client="ca-pub-2413601181805662"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
    </div>
  );
}
