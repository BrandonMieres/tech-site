import { useState, useEffect } from 'react';

export default function SplashLoader() {
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      window.dispatchEvent(new CustomEvent('splash-finished'));
      const destroyTimer = setTimeout(() => setIsDestroyed(true), 1000);
      return () => clearTimeout(destroyTimer);
    }, 1500);
    return () => clearTimeout(fadeTimer);
  }, []);

  if (isDestroyed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className={`flex flex-col items-center transition-transform duration-1000 ease-out ${isFading ? 'scale-110 opacity-0' : ''}`}>
        <img
          src="/favicon.png"
          alt="Next Gen Tech"
          className="w-16 h-16 mb-6 animate-[splash-fade-in_1s_ease-out_forwards] opacity-0"
        />
        <div className="h-[2px] w-32 bg-white/10 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 h-full w-full bg-white animate-[loading-bar_1.2s_ease-in-out_forwards]"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splash-fade-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
