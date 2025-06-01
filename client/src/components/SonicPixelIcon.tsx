// Icône Sonic pixel art pour fallback
import React from 'react';
import sonicPixel from '../assets/icons/sonic-pixel.svg';

export default function SonicPixelIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <img
      src={sonicPixel}
      alt="Sonic pixel art"
      style={{ width: 60, height: 60, ...style }}
      draggable={false}
    />
  );
}
