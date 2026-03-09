'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Fog({ opacity = 1 }: { opacity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    const configs = [
      { w: 900, h: 260, top: 50, left: -15, blur: 35, op: 0.75 },
      { w: 700, h: 200, top: 35, left: 25,  blur: 28, op: 0.65 },
      { w: 1000, h: 280, top: 62, left: 10,  blur: 42, op: 0.7  },
      { w: 650, h: 190, top: 25, left: 40,  blur: 25, op: 0.6  },
      { w: 800, h: 240, top: 70, left: -5,  blur: 38, op: 0.8  },
      { w: 550, h: 170, top: 45, left: 60,  blur: 22, op: 0.55 },
    ];

    configs.forEach((cfg, i) => {
      const layer = document.createElement('div');
      const alpha = cfg.op * opacity;
      layer.style.cssText = `
        position:absolute;
        width:${cfg.w}px;
        height:${cfg.h}px;
        background:radial-gradient(ellipse, rgba(210,220,230,${alpha}) 0%, rgba(200,215,228,${alpha * 0.4}) 50%, transparent 75%);
        border-radius:50%;
        top:${cfg.top}%;
        left:${cfg.left}%;
        filter:blur(${cfg.blur}px);
        pointer-events:none;
        opacity:0;
      `;
      container.appendChild(layer);
      layers.push(layer);

      // Fade in primero, luego flotado continuo
      const tween = gsap.timeline({ repeat: -1, delay: i * 0.8 });
      tween
        .to(layer, { opacity: 1, duration: 1.5, ease: 'power1.in' })
        .to(layer, {
          x: `+=${100 + i * 25}`,
          opacity: 0.85 + Math.random() * 0.15,
          duration: 9 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }, '-=0.5');

      tweens.push(...tween.getChildren() as gsap.core.Tween[]);
    });

    return () => {
      tweens.forEach(t => t.kill());
      layers.forEach(l => { if (container.contains(l)) container.removeChild(l); });
    };
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 6, pointerEvents: 'none' }}
    />
  );
}
