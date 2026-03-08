'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

interface HeroProps {
  onScrollDown?: () => void;
}

export default function Hero({ onScrollDown }: HeroProps) {
  const titleTopRef    = useRef<HTMLDivElement>(null);
  const titleBottomRef = useRef<HTMLDivElement>(null);
  const characterRef   = useRef<HTMLDivElement>(null);
  const subtitleRef    = useRef<HTMLParagraphElement>(null);
  const arrowRef       = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Estado inicial
    gsap.set([titleTopRef.current, titleBottomRef.current], { y: -60, opacity: 0 });
    gsap.set(characterRef.current, { y: 100, opacity: 0, scale: 0.92 });
    gsap.set(subtitleRef.current,  { y: 30, opacity: 0 });
    gsap.set(arrowRef.current,     { opacity: 0 });

    // Secuencia de entrada
    tl.to(titleTopRef.current,    { y: 0, opacity: 1, duration: 0.8 })
      .to(titleBottomRef.current, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .to(characterRef.current,   { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)' }, '-=0.6')
      .to(subtitleRef.current,    { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to(arrowRef.current,       { opacity: 1, duration: 0.4 }, '-=0.2');

    // Flecha: bounce infinito
    gsap.to(arrowRef.current, {
      y: 12,
      repeat: -1,
      yoyo: true,
      duration: 0.9,
      ease: 'sine.inOut',
      delay: 1.8,
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section className={styles.hero} id="hero">
      {/* Fondo: color sólido oscuro + textura sutil */}
      <div className={styles.bg} />

      {/* Título superior: "EL GATO" */}
      <div ref={titleTopRef} className={styles.titleTop}>
        <span className={styles.titleSmall}>EL</span>
        <span className={styles.titleBig}>GATO</span>
      </div>

      {/* Personaje principal — sobresale entre las dos líneas del título */}
      <div ref={characterRef} className={styles.characterWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/personajes/gato-con-botas.webp"
          alt="El Gato con Botas"
          className={styles.characterImg}
        />
      </div>

      {/* Título inferior: "CON BOTAS" */}
      <div ref={titleBottomRef} className={styles.titleBottom}>
        <span className={styles.titleBig}>CON</span>
        <span className={styles.titleAccent}>BOTAS</span>
      </div>

      {/* Subtítulo */}
      <p ref={subtitleRef} className={styles.subtitle}>
        Un cuento de astucia, valentía y botas muy elegantes
      </p>

      {/* Flecha scroll */}
      <button
        ref={arrowRef}
        className={styles.scrollArrow}
        onClick={onScrollDown}
        aria-label="Comenzar el cuento"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}
