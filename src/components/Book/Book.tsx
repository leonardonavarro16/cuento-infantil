// src/components/Book/Book.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './Book.module.css';
import { scenes } from '@/data/scenes';
import Character from '@/components/Character/Character';

export default function Book() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  // textVisible controla si el texto de la escena es visible.
  // Empieza oculto — el niño toca para revelar el texto,
  // y toca de nuevo para pasar de página.
  const [textVisible, setTextVisible] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const narrationRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Sonido de voltear página
  const playPageFlipSound = () => {
    const audio = new Audio('/audio/effects/page-flip.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Al cambiar de página reseteamos el texto a oculto
  useEffect(() => {
    setTextVisible(false);
  }, [currentPage]);

  // Animación del texto al hacerse visible
  useEffect(() => {
    if (textVisible) {
      // Ocultamos el hint
      if (hintRef.current) {
        gsap.to(hintRef.current, { opacity: 0, duration: 0.2 });
      }
      // Animamos título y narración desde abajo
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
      if (narrationRef.current) {
        gsap.fromTo(narrationRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' }
        );
      }
    } else {
      // Reseteamos estilos inline de GSAP al ocultar
      if (titleRef.current) gsap.set(titleRef.current, { clearProps: 'all' });
      if (narrationRef.current) gsap.set(narrationRef.current, { clearProps: 'all' });
      if (hintRef.current) gsap.set(hintRef.current, { clearProps: 'all' });
    }
  }, [textVisible]);

  // Siguiente página
  const nextPage = useCallback(() => {
    if (isFlipping || currentPage >= scenes.length - 1) return;

    setIsFlipping(true);
    playPageFlipSound();

    const rightPage = bookRef.current?.querySelector('.page-right');

    if (rightPage) {
      gsap.to(rightPage, {
        rotationY: -180,
        transformOrigin: 'left center',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentPage(prev => prev + 1);
          setIsFlipping(false);
          gsap.set(rightPage, { rotationY: 0 });
        }
      });
    }
  }, [isFlipping, currentPage]);

  // Página anterior
  const prevPage = useCallback(() => {
    if (isFlipping || currentPage <= 0) return;

    setIsFlipping(true);
    playPageFlipSound();

    const leftPage = bookRef.current?.querySelector('.page-left') as HTMLElement | null;

    if (leftPage) {
      // Elevamos z-index para que la página izquierda quede encima durante el giro
      gsap.set(leftPage, { zIndex: 10 });

      gsap.to(leftPage, {
        rotationY: 180,
        transformOrigin: 'right center',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentPage(prev => prev - 1);
          setIsFlipping(false);
          gsap.set(leftPage, { rotationY: 0, zIndex: 'auto' });
        }
      });
    } else {
      setCurrentPage(prev => prev - 1);
      setIsFlipping(false);
    }
  }, [isFlipping, currentPage]);

  // Click en la página derecha:
  // 1er toque → muestra el texto
  // 2º toque → avanza de página
  const handleRightPageClick = useCallback(() => {
    if (isFlipping) return;
    if (!textVisible) {
      setTextVisible(true);
    } else {
      nextPage();
    }
  }, [isFlipping, textVisible, nextPage]);

  // Navegación con teclado:
  // → : si texto oculto → muestra texto; si visible → siguiente página
  // ← : página anterior
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleRightPageClick();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleRightPageClick, prevPage]);

  // Refs para que el wheel handler siempre llame la versión más reciente
  const handleRightPageClickRef = useRef(handleRightPageClick);
  handleRightPageClickRef.current = handleRightPageClick;
  const prevPageRef = useRef(prevPage);
  prevPageRef.current = prevPage;

  // Scroll con rueda del ratón — cooldown de 1.6s para no disparar varias páginas
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    let lastScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScroll < 1600) return;
      lastScroll = now;

      if (e.deltaY > 0) {
        handleRightPageClickRef.current(); // scroll abajo → siguiente
      } else {
        prevPageRef.current();             // scroll arriba → anterior
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []); // solo se monta una vez, usa refs para callbacks frescos

  // Swipe táctil — para móvil/tablet
  // Swipe izquierda → siguiente | Swipe derecha → anterior
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let lastSwipe = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      // Solo procesamos si el gesto es más horizontal que vertical (swipe real)
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;
      // Umbral mínimo de 50px para no disparar con toques accidentales
      if (Math.abs(deltaX) < 50) return;

      const now = Date.now();
      if (now - lastSwipe < 1600) return;
      lastSwipe = now;

      if (deltaX < 0) {
        handleRightPageClickRef.current(); // swipe izquierda → siguiente
      } else {
        prevPageRef.current();             // swipe derecha → anterior
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // solo se monta una vez, usa refs para callbacks frescos

  const currentScene = scenes[currentPage];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📖 El Gato con Botas</h1>

      <div ref={bookRef} className={styles.book}>

        {/* Página Izquierda — click para retroceder */}
        <div
          className={`${styles.page} ${styles.pageLeft} page-left`}
          onClick={prevPage}
          style={{ cursor: currentPage > 0 ? 'pointer' : 'default' }}
        >
          <div
            className={styles.pageContent}
            style={{
              backgroundImage: currentPage > 0 ? `url(${scenes[currentPage - 1].background})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {currentPage === 0 ? (
              <div className={styles.cover}>
                <div className={styles.coverDecoration}>✦</div>
                <p className={styles.coverSubtitle}>Un cuento de</p>
                <h2 className={styles.coverTitle}>El Gato<br/>con Botas</h2>
                <p className={styles.coverAuthor}>Charles Perrault</p>
                <div className={styles.coverDecoration}>✦</div>
              </div>
            ) : (
              <>
                <div className={styles.overlay}></div>
                <h2 className={styles.sceneTitle}>{scenes[currentPage - 1].title}</h2>
                <p className={styles.narration}>{scenes[currentPage - 1].narration}</p>
                <span className={styles.pageNum}>{currentPage}</span>
              </>
            )}
          </div>
        </div>

        {/* Página Derecha — 1er toque: muestra texto / 2º toque: avanza */}
        <div
          className={`${styles.page} ${styles.pageRight} page-right`}
          onClick={handleRightPageClick}
          style={{ cursor: 'pointer' }}
        >
          <div
            className={styles.pageContent}
            style={{
              backgroundImage: `url(${currentScene.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Personajes de la escena */}
            {currentScene.characters.map((char, i) => (
              <Character
                key={`${currentPage}-${i}`}
                src={char.src}
                alt={char.alt}
                position={char.position}
                width={char.width}
                height={char.height}
                animation={char.animation}
                delay={char.delay}
              />
            ))}

            {/* Hint — visible cuando el texto está oculto */}
            <div
              ref={hintRef}
              className={`${styles.tapHint} ${textVisible ? styles.tapHintHidden : ''}`}
            >
              👆 Toca para leer
            </div>

            {/* Texto de la escena — oculto hasta que el usuario toca */}
            <div className={styles.textPanel}>
              <h2
                ref={titleRef}
                className={`${styles.sceneTitle} ${!textVisible ? styles.textHidden : ''}`}
              >
                {currentScene.title}
              </h2>
              <p
                ref={narrationRef}
                className={`${styles.narration} ${!textVisible ? styles.textHidden : ''}`}
              >
                {currentScene.narration}
              </p>
            </div>

            <span className={styles.pageNum}>{currentPage + 1}</span>
          </div>
        </div>

      </div>

      
    </div>
  );
}
