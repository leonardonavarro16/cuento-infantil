'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import Character from '@/components/Character/Character';
import type { Scene as SceneType } from '@/data/scenes';
import styles from './Scene.module.css';

interface SceneProps {
  scene: SceneType;
  onVisible?: (id: number) => void;
}

export default function Scene({ scene, onVisible }: SceneProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const charAreaRef = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);

  // Escenas impares: personajes a la izquierda. Pares: a la derecha.
  const isLeft = scene.id % 2 === 1;

  // Escala de personajes según cuántos hay en la escena
  const charScale = scene.characters.length === 1 ? 3.2 : 2.3;

  const stableOnVisible = useCallback((id: number) => onVisible?.(id), [onVisible]);

  useEffect(() => {
    const el      = sectionRef.current;
    const charArea = charAreaRef.current;
    const textEl   = textRef.current;
    if (!el || !charArea || !textEl) return;

    // Posiciones "fuera de pantalla" según qué lado corresponde
    const charOut = isLeft ? -30 : 30;
    const textOut = isLeft ?  20 : -20;

    // Estado inicial: oculto y desplazado
    gsap.set(charArea, { xPercent: charOut, opacity: 0 });
    gsap.set(textEl,   { xPercent: textOut, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        gsap.killTweensOf([charArea, textEl]);

        if (entry.isIntersecting) {
          // → Entrando: desliza hacia adentro
          stableOnVisible(scene.id);
          gsap.to(charArea, { xPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
          gsap.to(textEl,   { xPercent: 0, opacity: 1, duration: 0.85, delay: 0.2, ease: 'power3.out' });
        } else {
          // ← Saliendo: vuelve a su posición inicial (scroll hacia arriba)
          gsap.to(charArea, { xPercent: charOut, opacity: 0, duration: 0.5, ease: 'power2.in' });
          gsap.to(textEl,   { xPercent: textOut, opacity: 0, duration: 0.45, ease: 'power2.in' });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.killTweensOf([charArea, textEl]);
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
      <img src={scene.background} alt={scene.title} className={styles.bg} />

      {/* Área de personajes — mitad de la pantalla, animada con GSAP */}
      <div ref={charAreaRef} className={styles.charArea}>
        {scene.characters.map((char, i) => {
          const w = Math.round((char.width  ?? 130) * charScale);
          const h = Math.round((char.height ?? 175) * charScale);
          // Si la posición original usa calc(50% - Xpx), recalculamos con el nuevo ancho
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
            />
          );
        })}
      </div>

      {/* Panel de texto — otra mitad de la pantalla */}
      <div ref={textRef} className={styles.textArea}>
        <span className={styles.sceneNum}>{scene.id} / 12</span>
        <h2 className={styles.title}>{scene.title}</h2>
        <p className={styles.narration}>{scene.narration}</p>
      </div>
    </section>
  );
}
