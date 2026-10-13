import React, { forwardRef, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { animate, motion, useMotionValue, useIsPresent, type HTMLMotionProps } from 'motion/react';

const mediaQuery = '(prefers-reduced-motion: reduce)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(mediaQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
// Subscribe to OS preference changes as well as the initial preference.
function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(mediaQuery).matches, () => true);
}

const ease = [0.22, 1, 0.36, 1] as const;

// Animate only the visual text node; screen readers always receive the final value.
// No React render per frame. Stop interrupted animations on update/unmount.
export function AnimatedNumber({ value, digits = 3 }: { value: number; digits?: number }) {
  const reduced = useReducedMotion();
  const current = useMotionValue(value);
  const visual = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const write = (next: number) => { if (visual.current) visual.current.textContent = String(Math.round(next)); };
    if (reduced) { current.set(value); write(value); return; }
    write(current.get());
    const unsubscribe = current.on('change', write);
    const playback = animate(current, value, { duration: 0.38, ease });
    return () => { playback.stop(); unsubscribe(); };
  }, [value, reduced, current]);
  return <span className="inline-grid tabular-nums text-right" style={{ minWidth: Math.max(digits, String(value).length) + 'ch' }}>
    <span className="sr-only">{value}</span>
    <span ref={visual} aria-hidden="true">{value}</span>
  </span>;
}

export function ViewTransition({ children }: React.PropsWithChildren) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.18, ease }} className="min-w-0 w-full">{children}</motion.div>;
}

export const MotionResult = forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & { index: number; scanning?: boolean }>(function MotionResult({ index, scanning, children, ...props }, ref) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  return <motion.div {...props} ref={ref} layout={reduced ? false : 'position'}
    initial={reduced ? false : { opacity: 0, y: 6 }}
    animate={{ opacity: scanning ? 0.7 : 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -3 }}
    transition={{ duration: reduced ? 0 : 0.2, ease, delay: reduced || scanning ? 0 : Math.min(index, 5) * 0.025, layout: { duration: reduced ? 0 : 0.2, delay: 0 } }}
    whileHover={reduced ? undefined : { y: -1 }}
    inert={!present ? true : undefined} style={{ pointerEvents: present ? undefined : 'none' }}>
    {children}
  </motion.div>;
});

export function ScanStage({ children, active, complete, ...props }: HTMLMotionProps<'div'> & { active: boolean; complete: boolean }) {
  const reduced = useReducedMotion();
  return <motion.div {...props} aria-current={active ? 'step' : undefined} initial={false}
    animate={{ opacity: complete || active ? 1 : 0.55, y: active && !reduced ? -1 : 0 }}
    transition={{ duration: reduced ? 0 : 0.1, ease }}>{children}</motion.div>;
}

export function ProgressFill({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} style={{ transformOrigin: 'left', width: '100%' }}
    animate={{ scaleX: Math.min(1, Math.max(0, value / 100)) }} transition={{ duration: reduced ? 0 : 0.22, ease }} />;
}

export function InvestigationBackdrop({ children, className }: React.PropsWithChildren<{ className: string }>) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: reduced ? 0 : 0.16 }} inert={!present ? true : undefined}>{children}</motion.div>;
}
export function InvestigationPanel({ children, className }: React.PropsWithChildren<{ className: string }>) {
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return <motion.div ref={panel} tabIndex={-1} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || []).filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); panel.current?.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }} className={className} role="dialog" aria-modal="true" aria-label="Threat Investigation"
    initial={reduced ? false : { opacity: 0, y: 8, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: reduced ? 0 : 4, scale: 1 }} transition={{ duration: reduced ? 0 : 0.18, ease }}>{children}</motion.div>;
}
