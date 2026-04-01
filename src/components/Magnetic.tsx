import { useState, useRef, ReactNode, MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({ children, strength = 0.35, className = '' }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Middle point
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Move slightly towards mouse
    setPosition({ x: x * strength, y: y * strength });
  };

  const onMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`}
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {children}
    </div>
  );
}
