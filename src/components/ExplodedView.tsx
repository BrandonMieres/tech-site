import { useState, useEffect, useRef } from 'react';

interface Spec {
  label: string;
  value: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface Props {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  specs: Spec[];
}

export default function ExplodedView({ id, title, description, imageSrc, specs }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
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

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id={`exploded-${id}`}
      className="w-full h-[150vh] snap-start bg-black relative flex flex-col items-center justify-start py-32 overflow-hidden"
    >
      <div className="sticky top-20 z-20 text-center px-6 max-w-4xl">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Exploded Layers Parallax */}
      <div className="relative w-full max-w-5xl h-full mt-20 flex items-center justify-center">
        <div 
          className="relative w-full aspect-square md:aspect-video transition-transform duration-700 ease-out"
          style={{ 
            transform: `translateY(${scrollProgress * -150}px) rotateX(${scrollProgress * 15}deg)`,
            perspective: '1000px'
          }}
        >
          <img 
            src={imageSrc} 
            className="w-full h-full object-contain opacity-70"
            alt={`${title} diagram`}
          />
          
          {/* Floating Spec Labels */}
          {specs.map((spec, index) => (
            <div 
              key={index}
              className="absolute p-4 border border-white/20 backdrop-blur-md bg-white/5 rounded-lg transition-all duration-1000"
              style={{ 
                opacity: scrollProgress > 0.3 + (index * 0.1) ? 1 : 0, 
                transform: `translate(${scrollProgress * (index % 2 === 0 ? 40 : -40)}px, ${scrollProgress * (index > 1 ? 30 : -30)}px)`,
                top: spec.top,
                left: spec.left,
                right: spec.right,
                bottom: spec.bottom
              }}
            >
              <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-1">{spec.label}</p>
              <p className="text-white text-sm font-semibold">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" 
        style={{ opacity: scrollProgress }}
      />
    </section>
  );
}
