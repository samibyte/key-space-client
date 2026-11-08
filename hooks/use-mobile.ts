import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  const rafId = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Throttled to requestAnimationFrame to prevent layout thrashing during continuous resize
    const onChange = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        rafId.current = null;
      });
    };

    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onChange, { passive: true });

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return !!isMobile;
}
