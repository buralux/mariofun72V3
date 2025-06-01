// Icône Kirby pixel art pour fallback
import React from 'react';
import kirbyPixel from '../assets/icons/kirby-pixel.svg';

export default function KirbyPixelIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <img
      src={kirbyPixel}
      alt="Kirby pixel art"
      style={{ width: 60, height: 60, ...style }}
      draggable={false}
    />
  );
}
