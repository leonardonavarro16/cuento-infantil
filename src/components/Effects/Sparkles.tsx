'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const COLORS = ['#FFD700', '#FF8C42', '#ffffff', '#ffe066', '#ffb347'];

export default function Sparkles({ count = 35 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sparks: HTMLDivElement[] = [];
    const timelines: gsap.core.Timeline[] = [];

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      const size = 5 + Math.random() * 8;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      spark.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        background:radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 75%);
        border-radius:50%;
        left:${x}%;
        top:${y}%;
        box-shadow:0 0 ${size * 3}px ${size}px ${color}66;
        pointer-events:none;
        opacity:0;
        transform:scale(0.5);
      `;
      container.appendChild(spark);
      sparks.push(spark);

      // Cada chispa: aparece, pulsa y flota
      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 2 });
      tl.to(spark, { opacity: 0.9, scale: 1.2, duration: 0.4, ease: 'power2.out' })
        .to(spark, {
          x: `+=${Math.random() * 40 - 20}`,
          y: `-=${20 + Math.random() * 30}`,
          opacity: 0.7,
          scale: 1,
          duration: 1.2 + Math.random() * 0.8,
          ease: 'power1.inOut',
        })
        .to(spark, { opacity: 0, scale: 0.3, duration: 0.5, ease: 'power2.in' })
        .call(() => {
          gsap.set(spark, {
            x: 0, y: 0, scale: 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          });
        });

      timelines.push(tl);
    }

    return () => {
      timelines.forEach(t => t.kill());
      sparks.forEach(s => { if (container.contains(s)) container.removeChild(s); });
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 6, pointerEvents: 'none' }}
    />
  );
}
