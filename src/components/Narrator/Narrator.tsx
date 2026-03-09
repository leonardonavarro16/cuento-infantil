'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import styles from './Narrator.module.css';

interface NarratorProps {
  text: string;
  isSceneVisible: boolean;
  sceneId: number;
}

export default function Narrator({ text, isSceneVisible, sceneId }: NarratorProps) {
  const [isPlaying, setIsPlaying]        = useState(false);
  const [isLoading, setIsLoading]        = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [errorMsg, setErrorMsg]          = useState<string | null>(null);

  const catRef    = useRef<HTMLSpanElement>(null);
  const bounceRef = useRef<gsap.core.Tween | null>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setIsPlaying(false);
    setIsLoading(false);
    setActiveWordIdx(-1);
    bounceRef.current?.kill();
    bounceRef.current = null;
    if (catRef.current) gsap.to(catRef.current, { y: 0, rotation: 0, duration: 0.3 });
    window.dispatchEvent(new Event('narrator:stop'));
  }, []);

  const startAudio = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `/audio/narration/escena${sceneId}.mp3`;
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        window.dispatchEvent(new Event('narrator:play'));
        if (catRef.current) {
          bounceRef.current = gsap.to(catRef.current, {
            y: -5, rotation: 8, duration: 0.35,
            repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
        }
      };

      audio.ontimeupdate = () => {
        if (!audio.duration) return;
        const progress = audio.currentTime / audio.duration;
        const idx = Math.min(Math.floor(progress * words.length), words.length - 1);
        setActiveWordIdx(idx);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setActiveWordIdx(-1);
        bounceRef.current?.kill();
        bounceRef.current = null;
        if (catRef.current) gsap.to(catRef.current, { y: 0, rotation: 0, duration: 0.4 });
        window.dispatchEvent(new Event('narrator:stop'));
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        setErrorMsg('Audio no disponible');
      };

      await audio.play();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Narrator error:', msg);
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMsg('Audio no disponible');
    }
  }, [sceneId, words.length]);

  const togglePlay = useCallback(() => {
    if (isPlaying || isLoading) stopAudio();
    else startAudio();
  }, [isPlaying, isLoading, startAudio, stopAudio]);

  useEffect(() => {
    if (isSceneVisible) startAudio();
    else stopAudio();
  }, [isSceneVisible]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { audioRef.current?.pause(); bounceRef.current?.kill(); }, []);

  return (
    <div className={styles.narrator}>
      <button
        className={`${styles.playBtn} ${isPlaying ? styles.playing : ''} ${isLoading ? styles.loading : ''}`}
        onClick={togglePlay}
        disabled={isLoading}
        aria-label={isPlaying ? 'Parar narración' : 'Escuchar narración'}
      >
        <span ref={catRef} className={styles.catIcon}>
          {isLoading ? '⏳' : '🐱'}
        </span>
        <span className={styles.btnLabel}>
          {isLoading ? 'Cargando...' : isPlaying ? '■ Parar' : '▶ Escuchar'}
        </span>
        {isPlaying && <span className={styles.wave}>♪</span>}
      </button>

      {errorMsg && (
        <p style={{ color: '#FF8C42', fontSize: '0.78rem', margin: '0 0 8px', fontWeight: 700 }}>
          ⚠ {errorMsg}
        </p>
      )}

      <p className={styles.text}>
        {words.map((word, i) => (
          <span key={i} className={i === activeWordIdx ? styles.highlighted : ''}>
            {word}{' '}
          </span>
        ))}
      </p>
    </div>
  );
}
