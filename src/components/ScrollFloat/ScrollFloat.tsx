'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ScrollFloatProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function ScrollFloat({ text, className = '', delay = 0 }: ScrollFloatProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const chars = wrapRef.current.querySelectorAll<HTMLSpanElement>('.sf-char');

    gsap.fromTo(
      chars,
      { y: '110%', opacity: 0, rotateZ: 6 },
      {
        y: '0%',
        opacity: 1,
        rotateZ: 0,
        duration: 0.65,
        ease: 'back.out(1.7)',
        stagger: 0.04,
        delay,
      }
    );
  }, [delay]);

  return (
    <span
      ref={wrapRef}
      className={className}
      style={{ display: 'inline-block', overflow: 'hidden' }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="sf-char"
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
