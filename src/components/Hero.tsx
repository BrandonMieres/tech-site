import { useState, useEffect, useRef } from 'react';
import ParticleField from './ParticleField';
import Magnetic from './Magnetic';

const TITLE = 'Next Gen Tech.';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#&*';

function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text.split('').map(() => ' '));
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;
    const total = text.length;

    const step = () => {
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (ch === '.') return i < iteration ? '.' : CHARS[Math.floor(Math.random() * CHARS.length)];
        return i < iteration
          ? ch
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }));

      if (iteration < total) {
        iteration += 0.4;
        frameRef.current = setTimeout(step, 35);
      }
    };

    frameRef.current = setTimeout(step, 300);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [trigger, text]);

  return display;
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Only trigger scramble if both visible AND splash is done
  const scrambled = useScramble(TITLE, isVisible && isLoaded);

  useEffect(() => {
    // Handle splash completion
    const onSplashFinish = () => setIsLoaded(true);
    window.addEventListener('splash-finished', onSplashFinish);
    
    // Fallback if splash was already over or didn't trigger for some reason
    const fallback = setTimeout(() => setIsLoaded(true), 3000);

    const container = document.getElementById('scroll-container');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => setIsVisible(e.isIntersecting)),
      { threshold: 0.3, root: container }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('splash-finished', onSplashFinish);
      clearTimeout(fallback);
    };
  }, []);

  const scrollToProduct = () => {
    const container = document.getElementById('scroll-container');
    const target = document.getElementById('cascos');
    if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  };

  const base = 'transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const active = isVisible && isLoaded;

  // Lazy import ParticleField only on client
  const showParticles = typeof window !== 'undefined';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="w-full h-screen snap-start flex flex-col items-center justify-center relative overflow-hidden bg-black"
    >
      <img
        src="/images/hero.png"
        alt="Abstract dark tech background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-[1] pointer-events-none opacity-90" />

      {/* Particle Field */}
      {showParticles && <ParticleField />}

      <div className="z-20 text-center flex flex-col items-center px-4 max-w-5xl mx-auto">
        <h1
          className={`text-6xl md:text-[7rem] font-bold tracking-tighter mb-4 text-white leading-[1.1] ${base} font-mono ${active ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
        >
          {scrambled.join('')}
        </h1>
        <p
          className={`text-xl md:text-3xl text-zinc-400 font-medium tracking-tight mb-12 ${base} delay-100 font-sans ${active ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          Experience the pinnacle of hardware engineering.
        </p>
        <Magnetic strength={0.4}>
          <button
            onClick={scrollToProduct}
            className={`px-10 py-5 bg-white text-black rounded-full font-semibold tracking-wide hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-xl shadow-white/10 ${base} delay-300 ${active ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          >
            See Products
          </button>
        </Magnetic>
      </div>
    </section>
  );
}
