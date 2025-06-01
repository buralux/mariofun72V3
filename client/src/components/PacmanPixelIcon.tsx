// Icône Pac-Man pixel art pour fallback
import React from 'react';
import pacmanPixel from '../assets/icons/pacman-pixel.svg';

export default function PacmanPixelIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <img
      src={pacmanPixel}
      alt="Pac-Man pixel art"
      style={{ width: 60, height: 60, ...style }}
      draggable={false}
    />
  );
}
