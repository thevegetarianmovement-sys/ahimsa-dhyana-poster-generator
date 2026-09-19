import React, { useEffect, useRef } from 'react';
import type { UserData } from '../../types/poster';
import { drawPoster } from '../../canvas/posterRenderer';

interface Props {
  userData: UserData;
}

export const PosterPreview: React.FC<Props> = ({ userData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawPoster(canvasRef.current, userData, '/assets/poster-frame.png');
    }
  }, [userData]);

  return (
    <div className="bg-[#174d1c] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#246b2b] flex flex-col items-center lg:sticky lg:top-6">
      <h2 className="text-2xl font-bold text-[#ffca08] mb-6 w-full text-left flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Live Preview
      </h2>
      
      {/* Container for the poster */}
      <div className="relative w-full max-w-md mx-auto bg-[#0d2a10] rounded-xl overflow-hidden border-4 border-[#246b2b] shadow-2xl">
        <canvas 
          ref={canvasRef}
          className="w-full h-auto object-contain block"
          style={{ aspectRatio: '720 / 1077' }}
        />
      </div>

      <div className="mt-6 text-sm font-medium text-green-200/80 w-full text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#ffca08] animate-pulse"></span>
        Preview updates instantly as you type
      </div>
    </div>
  );
};
