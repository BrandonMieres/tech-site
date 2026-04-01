import { useState, useEffect, useRef } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only activate on pointer: fine devices (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.2);
      current.current.y = lerp(current.current.y, target.current.y, 0.2);
      setPos({ x: current.current.x, y: current.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      target.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const clickable = el.matches('button, a, input, select, [role="button"]') || !!el.closest('button, a, [role="button"]');
        setIsHovering(clickable);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', () => setIsVisible(false));
    window.addEventListener('mouseover', () => setIsVisible(true));
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', () => setIsVisible(false));
      window.removeEventListener('mouseover', () => setIsVisible(true));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block will-change-transform transition-[width,height,background-color,border-width] duration-200 ease-out"
      style={{
        width: isHovering ? '48px' : '28px',
        height: isHovering ? '48px' : '28px',
        backgroundColor: isHovering ? 'white' : 'transparent',
        border: isHovering ? '0px solid white' : '1px solid white',
        opacity: isVisible ? 1 : 0,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
      }}
    />
  );
}
