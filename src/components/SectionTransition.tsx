import { useState, useEffect, useRef } from 'react';

export default function SectionTransition() {
  const [active, setActive] = useState(false);
  const prevSection = useRef('hero');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const sections = ['hero', 'cascos', 'keyboard', 'laptop', 'mouse', 'grid'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && id !== prevSection.current) {
            prevSection.current = id;
            // Flash the curtain
            setActive(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setActive(false), 600);
          }
        });
      }, { threshold: 0.6, root: container });

      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach(o => o.disconnect());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Horizontal scan-line that sweeps across on section change */}
      <div
        className="fixed top-0 left-0 w-full h-[1px] z-[9990] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          animation: active ? 'scan-sweep 0.55s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
          opacity: active ? 1 : 0,
        }}
      />
      {/* Subtle full-screen flash */}
      <div
        className="fixed inset-0 z-[9989] pointer-events-none bg-white"
        style={{
          opacity: active ? 0.025 : 0,
          transition: active ? 'opacity 0.1s ease' : 'opacity 0.5s ease',
        }}
      />
      <style>{`
        @keyframes scan-sweep {
          0%   { transform: translateY(0vh);   opacity: 0; }
          5%   { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </>
  );
}
