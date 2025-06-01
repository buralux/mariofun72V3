import { useState } from 'react';
import Player from 'lottie-react';

export default function SafeLottie({ animationData, fallback, style }: { animationData: any; fallback?: React.ReactNode; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);
  const isValidLottie =
    animationData &&
    typeof animationData === 'object' &&
    Array.isArray(animationData.layers) &&
    animationData.layers.length > 0;

  if (!isValidLottie || error) {
    return (
      <div className="flex flex-col items-center justify-center" style={style}>
        {fallback ? fallback : <div className="text-5xl animate-spin" style={{ display: 'inline-block' }}>🟡</div>}
        <div className="text-xs text-yellow-500 mt-1">Animation non disponible</div>
      </div>
    );
  }
  return (
    <Player
      autoplay
      loop
      animationData={animationData}
      style={style}
      onError={() => setError(true)}
    />
  );
}
