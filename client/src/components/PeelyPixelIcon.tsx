import React from 'react';
import peelyPixel from '../assets/icons/peely-pixel.svg';

export default function PeelyPixelIcon({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <img
      src={peelyPixel}
      alt="Peely pixel art"
      style={style}
    />
  );
}
