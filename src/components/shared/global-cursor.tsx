'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function GlobalCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 420, damping: 34, mass: 0.35 });
  const smoothY = useSpring(cursorY, { stiffness: 420, damping: 34, mass: 0.35 });
  const trailX = useSpring(cursorX, { stiffness: 180, damping: 28, mass: 0.8 });
  const trailY = useSpring(cursorY, { stiffness: 180, damping: 28, mass: 0.8 });

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

    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const onLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };

    document.body.classList.add('custom-cursor-active');
    setEnabled(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorX, cursorY, pathname]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full border border-emerald-200/90 bg-emerald-300/20 shadow-[0_0_28px_rgba(0,229,160,0.75)] mix-blend-difference"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-16 w-16 rounded-full bg-emerald-300/20 blur-md mix-blend-exclusion"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}

