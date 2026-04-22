'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

type CursorMode = 'default' | 'interactive' | 'text';

export function GlobalCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.65 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.65 });

  useEffect(() => {
    const isProductivityRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

    if (isProductivityRoute) {
      document.body.classList.remove('custom-cursor-active');
      setEnabled(false);
      return;
    }

    const supportsFinePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;

    if (!supportsFinePointer) return;

    const resolveMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return 'default';

      if (
        target.closest(
          'a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-cta, .group'
        )
      ) {
        return 'interactive';
      }

      if (target.closest('h1, h2, h3, p, .hero-interactive-headline, .hero-inline-word, .hero-highlight-word')) {
        return 'text';
      }

      return 'default';
    };

    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      setMode(resolveMode(event.target));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onClick = (event: MouseEvent) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setRipples((prev) => [...prev, { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 420);
    };

    const onLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      setMode('default');
      setPressed(false);
    };

    document.body.classList.add('custom-cursor-active');
    setEnabled(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('click', onClick);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorX, cursorY, pathname]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full border border-emerald-100/70 bg-emerald-200/90 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: pressed ? 1.35 : mode === 'interactive' ? 1.2 : 1,
          mixBlendMode: mode === 'interactive' ? 'difference' : 'normal',
          backgroundColor: mode === 'interactive' ? 'rgba(255,255,255,0.92)' : 'rgba(167,243,208,0.92)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] border border-emerald-200/45 bg-emerald-300/5"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: mode === 'interactive' ? 56 : mode === 'text' ? 10 : 34,
          height: mode === 'interactive' ? 56 : mode === 'text' ? 34 : 34,
          borderRadius: mode === 'text' ? 8 : 999,
          opacity: mode === 'text' ? 0.65 : 0.55,
          filter: mode === 'text' ? 'blur(0.6px)' : 'blur(0px)',
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      />

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[9997] h-8 w-8 rounded-full border border-emerald-300/45"
            style={{ x: ripple.x, y: ripple.y, translateX: '-50%', translateY: '-50%' }}
            initial={{ scale: 0.2, opacity: 0.55 }}
            animate={{ scale: 2.1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

