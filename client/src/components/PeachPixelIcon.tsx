// Icône Peach pixel art pour fallback
import React from 'react';
import peachPixel from '../assets/icons/peach-pixel.svg';

export default function PeachPixelIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <img
      src={peachPixel}
      alt="Peach pixel art"
      style={{ width: 60, height: 60, ...style }}
      draggable={false}
    />
  );
}
