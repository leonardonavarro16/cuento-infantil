'use client';

// Character.tsx — Renderiza un personaje PNG sobre el fondo de la escena.
// Cada personaje se posiciona de forma absoluta, recibe su animación
// de entrada por props y reacciona al hover y al click.

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
// Usamos <img> nativo en lugar de next/image porque:
// 1. Las imágenes ya están en /public (no hay optimización externa necesaria)
// 2. next/image con width/height numéricos + style override causa conflictos
// 3. <img> es más predecible con position:absolute y dimensiones en px
import styles from './Character.module.css';

interface CharacterProps {
  src: string;        // Ruta al WebP transparente, ej: "/images/personajes/gato.webp"
  alt: string;        // Texto alternativo (accesibilidad)
  position: {
    x: string;        // Posición horizontal: "20%", "150px", etc.
    y: string;        // Posición desde abajo: "10%", "0px", etc.
  };
  width?: number;     // Ancho en px (default: 300)
  height?: number;    // Alto en px (default: 400)
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'pop'; // Tipo de entrada
  delay?: number;     // Retraso antes de aparecer (segundos)
  zIndex?: number;    // Orden de apilamiento (evita solapamientos)
  onClick?: () => void;
}

export default function Character({
  src,
  alt,
  position,
  width = 130,
  height = 175,
  animation = 'fadeUp',
  delay = 0,
  zIndex = 10,
  onClick,
}: CharacterProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Animación de entrada cuando el personaje aparece en pantalla.
  // Usamos 'from' de GSAP: define el estado INICIAL y anima HASTA
  // los valores CSS normales. Así el personaje "entra" en lugar de "salir".
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Limpiamos cualquier estado inline que GSAP haya dejado de ejecuciones
    // anteriores (problema con React StrictMode que monta efectos dos veces).
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'all' });

    // fromTo define EXPLÍCITAMENTE el estado inicial Y el estado final.
    // Así GSAP no depende del estado actual del elemento (que podría ser
    // opacity:0 de una animación anterior sin completar).
    const fromMap = {
      fadeUp:    { opacity: 0, y: 60, x: 0, scale: 1 },
      fadeLeft:  { opacity: 0, x: -80, y: 0, scale: 1 },
      fadeRight: { opacity: 0, x: 80, y: 0, scale: 1 },
      pop:       { opacity: 0, scale: 0.4, x: 0, y: 0 },
    };
    const fromVars = fromMap[animation];

    gsap.fromTo(
      el,
      fromVars,
      { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.7, delay, ease: 'power3.out' }
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [animation, delay]);

  // Click: efecto "bounce" — escala baja, sube y vuelve.
  // Transmite sensación de que el personaje reacciona al toque.
  const handleClick = () => {
    const el = ref.current;
    if (!el) return;

    gsap.timeline()
      .to(el, { scale: 0.92, duration: 0.1, ease: 'power2.in' })
      .to(el, { scale: 1.08, duration: 0.15, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' });

    onClick?.();
  };

  return (
    <div
      ref={ref}
      className={`${styles.character} ${onClick ? styles.clickable : ''}`}
      style={{
        // Posicionamos desde la esquina inferior izquierda de la página.
        // "bottom" para que los personajes "pisen" el suelo,
        // "left" para el eje horizontal.
        left: position.x,
        bottom: position.y,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
      }}
      onClick={handleClick}
    >
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
