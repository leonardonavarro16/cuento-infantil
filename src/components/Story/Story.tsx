'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { scenes } from '@/data/scenes';
import Scene from '@/components/Scene/Scene';
import styles from './Story.module.css';

const BG_MUSIC_SRC = '/audio/effects/musica-de-fondo.mp3';
const VOL_NORMAL   = 0.35;
const VOL_DUCKED   = 0.07;

export default function Story() {
  const [activeScene, setActiveScene] = useState(1);
  const lenisRef = useRef<Lenis | null>(null);
  const activeSceneRef = useRef(1);

  // ── Música de fondo ──────────────────────────────────────────
  const bgMusicRef     = useRef<HTMLAudioElement | null>(null);
  const musicReadyRef  = useRef(false);          // arrancada al menos una vez
  const [isMusicOn, setIsMusicOn] = useState(true);

  // ── Init música de fondo ─────────────────────────────────────
  useEffect(() => {
    const audio = new Audio(BG_MUSIC_SRC);
    audio.loop   = true;
    audio.volume = VOL_NORMAL;
    bgMusicRef.current = audio;

    const duck   = () => { if (bgMusicRef.current) bgMusicRef.current.volume = VOL_DUCKED; };
    const unduck = () => { if (bgMusicRef.current) bgMusicRef.current.volume = VOL_NORMAL; };
    window.addEventListener('narrator:play', duck);
    window.addEventListener('narrator:stop', unduck);

    return () => {
      audio.pause();
      window.removeEventListener('narrator:play', duck);
      window.removeEventListener('narrator:stop', unduck);
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = bgMusicRef.current;
    if (!audio) return;
    if (isMusicOn) {
      audio.pause();
      setIsMusicOn(false);
    } else {
      audio.play().catch(() => {});
      setIsMusicOn(true);
    }
  }, [isMusicOn]);

  // Inicializar Lenis
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll programático a una escena por id
  const scrollToScene = useCallback((id: number) => {
    const el = document.getElementById(`scene-${id}`);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Teclado: ↓/→ avanza, ↑/← retrocede
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(activeSceneRef.current + 1, scenes.length);
        scrollToScene(next);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(activeSceneRef.current - 1, 1);
        scrollToScene(prev);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scrollToScene]);

  const handleSceneVisible = useCallback((id: number) => {
    setActiveScene(id);
    activeSceneRef.current = id;
    // Arrancar música automáticamente la primera vez (ya hay interacción de usuario)
    if (!musicReadyRef.current && bgMusicRef.current) {
      bgMusicRef.current.play().catch(() => {});
      musicReadyRef.current = true;
    }
  }, []);

  return (
    <main className={styles.story}>
      {scenes.map(scene => (
        <Scene
          key={scene.id}
          scene={scene}
          onVisible={handleSceneVisible}
        />
      ))}

      {/* Botón música de fondo */}
      <button
        className={`${styles.musicBtn} ${isMusicOn ? styles.musicOn : ''}`}
        onClick={toggleMusic}
        aria-label={isMusicOn ? 'Silenciar música' : 'Activar música'}
        title={isMusicOn ? 'Silenciar música' : 'Activar música de fondo'}
      >
        {isMusicOn ? '🔊' : '🔇'}
      </button>

      {/* Navegación lateral — dots */}
      <nav className={styles.navDots} aria-label="Navegación de escenas">
        {scenes.map(scene => (
          <button
            key={scene.id}
            className={`${styles.dot} ${activeScene === scene.id ? styles.dotActive : ''}`}
            onClick={() => scrollToScene(scene.id)}
            aria-label={`Ir a escena ${scene.id}: ${scene.title}`}
            title={`${scene.id}. ${scene.title}`}
          />
        ))}
      </nav>
    </main>
  );
}
