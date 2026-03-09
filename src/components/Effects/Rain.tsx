'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Rain({ intensity = 'medium' }: { intensity?: 'light' | 'medium' | 'heavy' }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const count = intensity === 'light' ? 60 : intensity === 'heavy' ? 180 : 110;
    const drops: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      const h = 10 + Math.random() * 18;
      drop.style.cssText = `
        position:absolute;
        width:1.5px;
        height:${h}px;
        background:linear-gradient(to bottom,transparent,rgba(180,210,255,0.65));
        border-radius:2px;
        left:${Math.random() * 110 - 5}%;
        top:-${h}px;
        pointer-events:none;
      `;
      container.appendChild(drop);
      drops.push(drop);

      const tween = gsap.fromTo(
        drop,
        { y: 0, opacity: 0.6 + Math.random() * 0.4 },
        {
          y: '110vh',
          duration: 0.45 + Math.random() * 0.55,
          ease: 'none',
          delay: Math.random() * 3,
          repeat: -1,
          onRepeat: () => {
            gsap.set(drop, { left: `${Math.random() * 110 - 5}%` });
          },
        }
      );
      tweens.push(tween);
    }

    return () => {
      tweens.forEach(t => t.kill());
      drops.forEach(d => { if (container.contains(d)) container.removeChild(d); });
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 4, pointerEvents: 'none' }}
    />
  );
}
