import { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    lastScrollY.current = container.scrollTop;

    const onScroll = () => {
      const currentScrollY = container.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToFront = () => {
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center pt-6 px-4 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-between px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Magnetic strength={0.2}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToFront}>
            <img src="/favicon.png" className="w-6 h-6 opacity-90 group-hover:opacity-100 transition-opacity" alt="Logo" />
            <span className="text-white font-semibold tracking-tight text-sm hidden sm:block">Next Gen Tech</span>
          </div>
        </Magnetic>
        <Magnetic strength={0.5}>
          <button className="bg-white text-black text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform duration-300">
            Pre-Order
          </button>
        </Magnetic>
      </div>
    </nav>
  );
}
