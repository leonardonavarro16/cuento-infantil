'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CursorFollower.module.css';

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onDown  = () => gsap.to(el, { scale: 0.75, duration: 0.15 });
    const onUp    = () => gsap.to(el, { scale: 1,    duration: 0.2,  ease: 'elastic.out(1.2, 0.5)' });
    const onEnterBtn = () => gsap.to(el, { scale: 1.4, duration: 0.2 });
    const onLeaveBtn = () => gsap.to(el, { scale: 1,   duration: 0.2 });

    // Bigger on interactive elements
    const addHoverListeners = () => {
      document.querySelectorAll('button, a, [role="button"]').forEach(btn => {
        btn.addEventListener('mouseenter', onEnterBtn);
        btn.addEventListener('mouseleave', onLeaveBtn);
      });
    };

    gsap.set(el, { x: -100, y: -100 }); // off-screen initially
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // Add hover listeners after a tick
    const t = setTimeout(addHoverListeners, 500);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      clearTimeout(t);
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor}>🐾</div>;
}
