import React from 'react';

export default function ChestPixelIcon({ style = {} }: { style?: React.CSSProperties }) {
  // Simple pixel art chest SVG (placeholder, replace with your own if needed)
  return (
    <svg viewBox="0 0 32 32" width={style.width || 120} height={style.height || 120} style={style}>
      <rect x="4" y="12" width="24" height="12" fill="#b8860b" stroke="#654321" strokeWidth="2" />
      <rect x="4" y="8" width="24" height="8" fill="#deb887" stroke="#654321" strokeWidth="2" />
      <rect x="13" y="18" width="6" height="6" fill="#fff8dc" stroke="#654321" strokeWidth="1" />
      <rect x="15" y="20" width="2" height="2" fill="#ffd700" stroke="#654321" strokeWidth="1" />
      <rect x="4" y="20" width="24" height="4" fill="#8b5c2a" stroke="#654321" strokeWidth="2" />
    </svg>
  );
}
