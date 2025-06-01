// Icône Bowser pixel art pour fallback
import React from 'react';
import bowserPixel from '../assets/icons/bowser-pixel.svg';

export default function BowserPixelIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <img
      src={bowserPixel}
      alt="Bowser pixel art"
      style={{ width: 60, height: 60, ...style }}
      draggable={false}
    />
  );
}
