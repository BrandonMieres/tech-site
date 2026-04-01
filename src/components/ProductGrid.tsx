import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';

interface Product {
  id: string;
  title: string;
  videoSrc: string;
  description: string;
}

interface Stat { label: string; value: number; unit: string; }

const PRODUCT_STATS: Record<string, Stat[]> = {
  cascos:   [{ label: 'Frequency', value: 40, unit: 'kHz' }, { label: 'Battery', value: 96, unit: 'h' }, { label: 'Drivers', value: 50, unit: 'mm' }],
  keyboard: [{ label: 'Actuation', value: 1.2, unit: 'mm' }, { label: 'Keys', value: 104, unit: '' }, { label: 'Polling', value: 1000, unit: 'Hz' }],
  laptop:   [{ label: 'RAM', value: 64, unit: 'GB' }, { label: 'Weight', value: 1.4, unit: 'kg' }, { label: 'Battery', value: 22, unit: 'h' }],
  mouse:    [{ label: 'DPI', value: 25600, unit: '' }, { label: 'Latency', value: 0.5, unit: 'ms' }, { label: 'Buttons', value: 11, unit: '' }],
};

function StatCounter({ stat, active }: { stat: Stat; active: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    const duration = 1200;
    const start = performance.now();
    const target = stat.value;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(target < 10 ? 1 : 0)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, stat.value]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-white tabular-nums">
        {count}{stat.unit}
      </span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{stat.label}</span>
    </div>
  );
}

function BentoCard({ product, span, tall, onOpen }: {
  product: Product; span?: string; tall?: boolean; onOpen: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stats = PRODUCT_STATS[product.id] || [];

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - left, y: e.clientY - top });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onClick={() => onOpen(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.9)] hover:border-white/10 flex flex-col ${span || ''} ${tall ? 'min-h-[520px]' : 'min-h-[300px]'}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />

      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          src={product.videoSrc}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"
          muted playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />
      </div>

      <div className="p-8 shrink-0 z-20">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">{product.title}</h3>
          <span className={`text-white/40 text-sm font-medium flex items-center gap-2 transition-all duration-300 ${hovered ? 'gap-4 text-white/70' : ''}`}>
            View <span className="transition-all text-xl">{hovered ? '→' : '·'}</span>
          </span>
        </div>

        <div className={`grid grid-cols-3 gap-2 border-t border-white/5 pt-5 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          {stats.map(s => <StatCounter key={s.label} stat={s} active={hovered} />)}
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [p0, p1, p2, p3] = products;

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 auto-rows-[1fr]">
        <BentoCard product={p0} span="col-span-2" tall onOpen={setSelected} />
        <BentoCard product={p1} span="col-span-1" tall onOpen={setSelected} />
        <BentoCard product={p2} span="col-span-1" tall onOpen={setSelected} />
        <BentoCard product={p3} span="col-span-2" tall onOpen={setSelected} />
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100]">
          <Modal product={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
