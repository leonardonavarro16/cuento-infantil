'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Character.module.css';

interface CharacterProps {
  src: string;
  alt: string;
  position: { x: string; y: string };
  width?: number;
  height?: number;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'pop';
  delay?: number;
  bubble?: string;
  zIndex?: number;
  onClick?: () => void;
  // Partículas personalizadas por tipo de personaje
  particles?: string[];
}

// Partículas por defecto — estrellas y destellos
const DEFAULT_PARTICLES = ['⭐', '✨', '💫', '🌟', '✨', '⭐'];

export default function Character({
  src,
  alt,
  position,
  width = 130,
  height = 175,
  animation = 'fadeUp',
  delay = 0,
  bubble = '',
  zIndex = 10,
  onClick,
  particles = DEFAULT_PARTICLES,
}: CharacterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idleRef = useRef<gsap.core.Tween | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Animación de entrada
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'all' });

    // Prepare bubble hidden
    const bubbleEl = bubbleRef.current;
    if (bubbleEl) gsap.set(bubbleEl, { scale: 0, opacity: 0, transformOrigin: 'bottom center' });

    const fromMap = {
      fadeUp:    { opacity: 0, y: 60, x: 0, scale: 1 },
      fadeLeft:  { opacity: 0, x: -80, y: 0, scale: 1 },
      fadeRight: { opacity: 0, x: 80, y: 0, scale: 1 },
      pop:       { opacity: 0, scale: 0.4, x: 0, y: 0 },
    };

    gsap.fromTo(
      el,
      fromMap[animation],
      {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration: 0.7, delay,
        ease: 'power3.out',
        onComplete: () => {
          startIdleHint(el);
          // Animate bubble in
          if (bubbleEl) {
            gsap.to(bubbleEl, {
              scale: 1, opacity: 1,
              duration: 0.5, delay: 0.3,
              ease: 'elastic.out(1.1, 0.5)',
            });
          }
        },
      }
    );

    return () => {
      gsap.killTweensOf(el);
      idleRef.current?.kill();
    };
  }, [animation, delay]);

  // Float continuo: sube y baja suavemente como si respirara
  const startIdleHint = (el: HTMLDivElement) => {
    idleRef.current?.kill();
    // Offset aleatorio para que no todos los personajes floten sincronizados
    const offsetDelay = Math.random() * 1.5;
    idleRef.current = gsap.to(el, {
      y: -10,
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: offsetDelay,
    });
  };

  // Burst de partículas emoji desde el centro del personaje
  const spawnParticles = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3; // Un tercio desde arriba — más visual

    const count = 7;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.textContent = particles[Math.floor(Math.random() * particles.length)];
      span.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        font-size: ${1.2 + Math.random() * 0.8}rem;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        user-select: none;
      `;
      document.body.appendChild(span);

      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const dist = 55 + Math.random() * 45;

      gsap.to(span, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        opacity: 0,
        scale: 0.4,
        duration: 0.75 + Math.random() * 0.35,
        ease: 'power2.out',
        onComplete: () => span.remove(),
      });
    }
  };

  const handleClick = () => {
    const el = ref.current;
    if (!el) return;

    // Detener idle mientras reacciona
    idleRef.current?.kill();

    // Bounce expresivo — al terminar retoma el float
    gsap.timeline({
      onComplete: () => startIdleHint(el),
    })
      .to(el, { scale: 0.88, y: 0,   duration: 0.1,  ease: 'power2.in' })
      .to(el, { scale: 1.15, y: -18, duration: 0.18, ease: 'power2.out' })
      .to(el, { scale: 1,    y: 0,   duration: 0.5,  ease: 'elastic.out(1.2, 0.4)' });

    spawnParticles(el);
    onClick?.();
  };

  return (
    <div
      ref={ref}
      className={styles.character}
      style={{
        left: position.x,
        bottom: position.y,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
      }}
      onClick={handleClick}
    >
      {bubble && (
        <div ref={bubbleRef} className={styles.bubble}>
          {bubble}
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          display: 'block',
        }}
      />
    </div>
  );
}
