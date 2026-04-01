import { useState, useEffect, useRef } from 'react';

interface Props {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  index: number;
}

export default function ProductSection({ id, title, description, videoSrc, index }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (containerRect.bottom - rect.top) / (containerRect.height + rect.height)));
      setScrollProgress(progress);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const visible = entry.isIntersecting;
          setIsVisible(visible);

          if (visible) {
            setHasEntered(false);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setHasEntered(true));
            });
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
          } else {
            setHasEntered(false);
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.4, root: container }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    container.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', onScroll);
    };
  }, [id]);

  const scrollToNext = () => {
    const container = document.getElementById('scroll-container');
    const order = ['cascos', 'keyboard', 'laptop', 'mouse', 'grid'];
    const nextId = order[order.indexOf(id) + 1] || 'grid';
    const target = document.getElementById(nextId);
    if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id={id} className="w-full h-screen snap-start relative bg-black flex flex-col items-start justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoSrc}
          muted
          playsInline
        />
      </div>

      <div
        className="absolute inset-0 z-10 bg-black mix-blend-multiply flex items-center justify-center pointer-events-none overflow-hidden"
        style={{
          animation: hasEntered ? 'mask-container-vanish 5s ease-in-out forwards' : 'none',
          animationDelay: '0.5s',
        }}
      >
        <h2
          className="text-[13vw] font-black tracking-tighter text-white uppercase text-center w-full px-4 will-change-transform leading-none"
          style={{
            transform: isVisible && !hasEntered ? 'translateY(0)' : isVisible ? undefined : 'translateY(130px)',
            opacity: isVisible ? 1 : 0,
            transition: !hasEntered ? 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease' : 'none',
            animation: hasEntered ? 'text-push-through 5s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
            animationDelay: '0.5s',
          }}
        >
          {title}
        </h2>
      </div>

      <div
        className={`absolute bottom-12 md:bottom-24 left-8 md:left-24 z-20 max-w-xl transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        style={{ transitionDelay: isVisible ? '4s' : '0s' }}
      >
        <p 
          className="text-xl md:text-2xl mb-8 font-medium tracking-tight border-l-2 border-white/20 pl-6 leading-relaxed transition-colors duration-700"
          style={{ 
            color: scrollProgress > 0.4 ? '#ffffff' : '#52525b', 
            textShadow: scrollProgress > 0.4 ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {description}
        </p>
        <button
          onClick={scrollToNext}
          className="px-8 py-4 bg-white/10 backdrop-blur-3xl rounded-full text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-500 font-semibold uppercase tracking-widest text-xs flex items-center gap-4 border border-white/10 hover:border-transparent shadow-xl"
        >
          Explore Tech <span className="text-lg leading-none">↓</span>
        </button>
      </div>

      <style>{`
        @keyframes text-push-through {
          0%   { transform: scale(1)  translateY(0); }
          100% { transform: scale(12) translateY(0); }
        }

        @keyframes mask-container-vanish {
          0%   { opacity: 1; }
          15%  { opacity: 1; }
          50%  { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
