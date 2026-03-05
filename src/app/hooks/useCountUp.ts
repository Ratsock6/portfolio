import { useEffect, useMemo, useRef, useState } from "react";

type Options = {
  durationMs?: number;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountUp(target: number | null | undefined, opts: Options = {}) {
  const durationMs = opts.durationMs ?? 900;

  const [value, setValue] = useState<number>(() => Number(target ?? 0));
  const prevTargetRef = useRef<number>(Number(target ?? 0));

  const shouldAnimate = useMemo(() => !prefersReducedMotion(), []);

  useEffect(() => {
    const next = Number(target ?? 0);
    const prev = prevTargetRef.current;

    // si pas d'anim (accessibilité) ou pas de changement
    if (!shouldAnimate || next === prev) {
      prevTargetRef.current = next;
      setValue(next);
      return;
    }

    const start = performance.now();
    const from = prev;
    const diff = next - from;

    let raf = 0;

    // easeOutCubic
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = ease(t);
      const current = Math.round(from + diff * eased);

      setValue(current);

      if (t < 1) raf = requestAnimationFrame(tick);
      else prevTargetRef.current = next;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, shouldAnimate]);

  return value;
}