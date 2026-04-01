import { useEffect, useRef } from 'react';

interface Props {
  product: {
    id: string;
    title: string;
    videoSrc: string;
    description: string;
  };
  onClose: () => void;
}

export default function Modal({ product, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-6xl bg-[#0a0a0a]/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row animate-[modal-scale-in_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] backdrop-blur-3xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/10 hover:bg-white rounded-full text-white hover:text-black flex items-center justify-center transition-all duration-300 backdrop-blur cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video Side */}
        <div className="w-full md:w-3/5 min-h-[300px] md:min-h-[600px] bg-black relative">
          <video
            ref={videoRef}
            src={product.videoSrc}
            className="w-full h-full object-cover relative z-10"
            muted
            playsInline
          />
        </div>

        {/* Content Side */}
        <div className="w-full md:w-2/5 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <h3 className="text-4xl font-extrabold text-white mb-6">{product.title}</h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
            {product.description} Dive deeper into the features that elevate this product above the rest. Unmatched precision,
            fluid movements, and state-of-the-art materials crafted to perfection.
          </p>
          <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-3xl font-bold tracking-tight">$299</span>
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
