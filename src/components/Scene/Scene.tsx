'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import Character from '@/components/Character/Character';
import Rain from '@/components/Effects/Rain';
import Fog from '@/components/Effects/Fog';
import Leaves from '@/components/Effects/Leaves';
import Sparkles from '@/components/Effects/Sparkles';
import type { Scene as SceneType } from '@/data/scenes';
import Narrator from '@/components/Narrator/Narrator';
import styles from './Scene.module.css';

interface SceneProps {
  scene: SceneType;
  onVisible?: (id: number) => void;
}

// Chime mágico con Web Audio API — sin archivos extra
function playSceneChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Dos notas: Do5 → Sol5, sonido de cuento
    const notes = [523.25, 783.99];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.9);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.9);
    });
  } catch {
    // Silencioso si el navegador bloquea AudioContext
  }
}

export default function Scene({ scene, onVisible }: SceneProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgRef       = useRef<HTMLImageElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const charAreaRef = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isLeft   = scene.id % 2 === 1;
  const charScale = scene.characters.length === 1 ? 3.2 : 2.3;

  const stableOnVisible = useCallback((id: number) => onVisible?.(id), [onVisible]);

  useEffect(() => {
    const el       = sectionRef.current;
    const bg       = bgRef.current;
    const overlay  = overlayRef.current;
    const charArea = charAreaRef.current;
    const textEl   = textRef.current;
    if (!el || !bg || !overlay || !charArea || !textEl) return;

    const charOut = isLeft ? -30 : 30;
    const textOut = isLeft ?  20 : -20;

    // Estado inicial: todo oculto
    gsap.set(overlay,  { opacity: 1 });
    gsap.set(bg,       { scale: 1.08, filter: 'blur(6px)' });
    gsap.set(charArea, { xPercent: charOut, opacity: 0 });
    gsap.set(textEl,   { xPercent: textOut, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        gsap.killTweensOf([bg, overlay, charArea, textEl]);

        if (entry.isIntersecting) {
          setIsVisible(true);
          stableOnVisible(scene.id);
          playSceneChime();

          // 1. Fondo: desblurrea y escala hacia su tamaño normal
          gsap.to(bg, {
            scale: 1, filter: 'blur(0px)',
            duration: 0.9, ease: 'power2.out',
          });
          // 2. Overlay oscuro: se desvanece
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.7, ease: 'power2.out',
          });
          // 3. Personajes y texto entran después
          gsap.to(charArea, { xPercent: 0, opacity: 1, duration: 0.85, delay: 0.25, ease: 'power3.out' });
          gsap.to(textEl,   { xPercent: 0, opacity: 1, duration: 0.85, delay: 0.4,  ease: 'power3.out' });

        } else {
          setIsVisible(false);

          // Salida: overlay cubre, fondo vuelve a estado inicial
          gsap.to(overlay,  { opacity: 1, duration: 0.4, ease: 'power2.in' });
          gsap.to(bg,       { scale: 1.08, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' });
          gsap.to(charArea, { xPercent: charOut, opacity: 0, duration: 0.4, ease: 'power2.in' });
          gsap.to(textEl,   { xPercent: textOut, opacity: 0, duration: 0.35, ease: 'power2.in' });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.killTweensOf([bg, overlay, charArea, textEl]);
    };
  }, [scene.id, isLeft, stableOnVisible]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.scene} ${isLeft ? styles.layoutLeft : styles.layoutRight}`}
      id={`scene-${scene.id}`}
    >
      {/* Fondo fullscreen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={bgRef} src={scene.background} alt={scene.title} className={styles.bg} />

      {/* Overlay de transición — capa negra que se desvanece al entrar */}
      <div ref={overlayRef} className={styles.transitionOverlay} />

      {/* Efectos ambientales */}
      {scene.effects?.includes('rain')       && <Rain intensity="medium" />}
      {scene.effects?.includes('rain-heavy') && <Rain intensity="heavy" />}
      {scene.effects?.includes('fog')        && <Fog />}
      {scene.effects?.includes('leaves')     && <Leaves />}
      {scene.effects?.includes('sparkles')   && <Sparkles />}

      {/* Área de personajes */}
      <div ref={charAreaRef} className={styles.charArea}>
        {scene.characters.map((char, i) => {
          const w = Math.round((char.width  ?? 130) * charScale);
          const h = Math.round((char.height ?? 175) * charScale);
          const x = char.position.x.startsWith('calc(50%')
            ? `calc(50% - ${Math.round(w / 2)}px)`
            : char.position.x;
          return (
            <Character
              key={i}
              {...char}
              position={{ x, y: char.position.y }}
              width={w}
              height={h}
              zIndex={10 + i}
              particles={char.particles}
            />
          );
        })}
      </div>

      {/* Panel de texto */}
      <div ref={textRef} className={styles.textArea}>
        <span className={styles.sceneNum}>{scene.id} / 12</span>
        <h2 className={styles.title}>{scene.title}</h2>
        <Narrator text={scene.narration} isSceneVisible={isVisible} sceneId={scene.id} />
      </div>
    </section>
  );
}
