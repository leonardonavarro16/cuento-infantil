'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollFloat from '@/components/ScrollFloat/ScrollFloat';
import MetaBalls from '@/components/MetaBalls/MetaBalls';
import styles from './Intro.module.css';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [mounted, setMounted] = useState(false);
  const scene2Ref   = useRef<HTMLDivElement>(null);
  const bigTitleRef = useRef<HTMLHeadingElement>(null);
  const panelsRef   = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);
  const logoRef     = useRef<HTMLDivElement>(null);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const btnFloatRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const goToScene2 = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    gsap.timeline()
      .to(scene2Ref.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.9,
        ease: 'power2.inOut',
      })
      .fromTo(
        bigTitleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        panelsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .call(() => {
        const btn = btnRef.current;
        if (!btn) return;
        // Flotación continua tras la entrada
        btnFloatRef.current = gsap.to(btn, {
          y: -12, duration: 1.5,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      });
  }, []);

  // Hover sobre el botón COMENZAR
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onEnter = () => {
      btnFloatRef.current?.pause();
      gsap.to(btn, { scale: 1.06, duration: 0.2, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(btn, {
        scale: 1, duration: 0.2, ease: 'power2.in',
        onComplete: () => { btnFloatRef.current?.resume(); },
      });
    };
    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
      btnFloatRef.current?.kill();
    };
  }, []);

  // Hover sobre el logo: cada letra cambia de color en cascada
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const colors = ['#FFD700', '#FF8C42', '#DC143C', '#FF8C42', '#FFD700'];

    const onEnter = () => {
      const chars = logo.querySelectorAll<HTMLSpanElement>('.sf-char');
      gsap.to(chars, {
        color: (i: number) => colors[i % colors.length],
        duration: 0.25,
        stagger: 0.04,
        ease: 'power1.out',
      });
    };

    const onLeave = () => {
      const chars = logo.querySelectorAll<HTMLSpanElement>('.sf-char');
      gsap.to(chars, {
        color: 'rgba(255, 248, 220, 0.92)',
        duration: 0.4,
        stagger: 0.03,
        ease: 'power1.inOut',
      });
    };

    logo.addEventListener('mouseenter', onEnter);
    logo.addEventListener('mouseleave', onLeave);
    return () => {
      logo.removeEventListener('mouseenter', onEnter);
      logo.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Scroll hacia abajo → scene 2
  useEffect(() => {
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) goToScene2(); };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goToScene2]);

  // Swipe up móvil → scene 2
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (startY - e.changedTouches[0].clientY > 50) goToScene2();
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goToScene2]);

  return (
    <div className={`${styles.intro} ${mounted ? styles.visible : ''}`}>

      {/* ── NAVBAR ── */}
      <nav className={styles.navbar}>
        <span className={styles.navItem}>UN CUENTO</span>
        <span className={styles.navLine} />
        <span className={styles.navCenter}>EL GATO CON BOTAS</span>
        <span className={styles.navLine} />
        <span className={styles.navItem}>CHARLES PERRAULT</span>
      </nav>

      {/* ── ESCENA 1: vídeo ── */}
      <div className={styles.scene1}>
        <video
          className={styles.video}
          src="/images/escenarios/video-canva.mp4"
          autoPlay
          muted
          playsInline
          onEnded={goToScene2}
        />
        <div className={styles.scene1Overlay} />

        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={3}
          ballCount={10}
          animationSize={45}
          enableMouseInteraction
          enableTransparency
          hoverSmoothness={0.04}
          clumpFactor={1.4}
          speed={0.12}
          style={{ zIndex: 1, opacity: 0.6 }}
        />

        <div ref={logoRef} className={styles.scene1Logo}>
          <ScrollFloat text="EL GATO" delay={0.3} />
          <br />
          <ScrollFloat text="CON BOTAS" delay={0.6} />
        </div>

        <p className={styles.tagline}>ÉRASE UNA VEZ, EN UN REINO MUY LEJANO...</p>

        <button className={styles.skipBtn} onClick={goToScene2}>
          Continuar ↓
        </button>
      </div>

      {/* ── ESCENA 2: hero reveal ── */}
      <div ref={scene2Ref} className={styles.scene2}>
        <div className={styles.scene2Bg} />
        <div className={styles.scene2Overlay} />

        <h1 ref={bigTitleRef} className={styles.bigTitle}>
          Un astuto gato transforma la suerte de su amo<br />
          con ingenio, valentía y sus famosas botas.
        </h1>

        <div ref={panelsRef} className={styles.bottomPanels}>
          <div className={styles.panelLeft}>
            <button ref={btnRef} className={styles.btn} onClick={onComplete}>
              COMENZAR <span className={styles.arrow}>›</span>
            </button>
          </div>

          <div className={styles.panelRight}>
            <span className={styles.statNum}>12</span>
            <span className={styles.statLabel}>Escenas del cuento</span>
            <div className={styles.statDots}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className={styles.dot} />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
