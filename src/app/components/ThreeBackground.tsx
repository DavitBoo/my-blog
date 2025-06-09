import React from 'react'
import { useThreeScene } from '../hooks/useThreeScene';

interface ThreeBackgroundProps {
  className?: string;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ className }) => {
  const { canvasRef } = useThreeScene();

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};