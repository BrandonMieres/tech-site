import { useState, useEffect, useRef } from 'react';

interface NavItem { id: string; label: string; }

const navItems: NavItem[] = [
  { id: 'hero', label: 'Intro' },
  { id: 'cascos', label: 'Quantum Headset' },
  { id: 'keyboard', label: 'Apex Keyboard' },
  { id: 'laptop', label: 'Pro Laptop' },
  { id: 'mouse', label: 'Precision Mouse' },
  { id: 'grid', label: 'All Products' },
];

export default function Navigation() {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0.6, root: container }
    );
    navItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const container = document.getElementById('scroll-container');
    const target = document.getElementById(id);
    if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  };

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 items-center">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`rounded-full transition-all duration-500 ease-out hover:bg-white relative group ${
            activeId === item.id
              ? 'w-1.5 h-8 bg-white'
              : 'w-1 h-1 bg-white/30 hover:h-4'
          }`}
        >
          <span
            className={`absolute right-6 top-1/2 -translate-y-1/2 text-xs font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
              activeId === item.id ? 'text-white' : 'text-zinc-400'
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
