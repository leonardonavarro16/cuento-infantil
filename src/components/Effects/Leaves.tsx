'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SHAPES = ['🍃', '🍂', '🍁'];

export default function Leaves({ count = 18 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const leaves: HTMLDivElement[] = [];
    const timelines: gsap.core.Timeline[] = [];

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      const emoji = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const size = 13 + Math.random() * 14;
      leaf.textContent = emoji;
      leaf.style.cssText = `
        position:absolute;
        font-size:${size}px;
        left:${Math.random() * 100}%;
        top:-40px;
        opacity:0;
        user-select:none;
        pointer-events:none;
      `;
      container.appendChild(leaf);
      leaves.push(leaf);

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 6 });
      tl.to(leaf, {
        y: `${85 + Math.random() * 20}vh`,
        x: `+=${Math.random() * 180 - 90}`,
        rotation: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 200),
        opacity: 0.85,
        duration: 5 + Math.random() * 4,
        ease: 'none',
      })
        .to(leaf, { opacity: 0, duration: 0.6 }, '-=0.6')
        .call(() => {
          gsap.set(leaf, { y: 0, x: 0, opacity: 0, left: `${Math.random() * 100}%`, top: '-40px', rotation: 0 });
        });

      timelines.push(tl);
    }

    return () => {
      timelines.forEach(t => t.kill());
      leaves.forEach(l => { if (container.contains(l)) container.removeChild(l); });
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 4, pointerEvents: 'none' }}
    />
  );
}
