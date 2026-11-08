import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook that returns a debounced version of the passed value.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds (defaults to 300ms).
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that returns a stable debounced callback function.
 * Uses useRef to preserve mutable timer reference without causing re-renders.
 * @param callback The function to debounce.
 * @param delay The debounce delay in milliseconds (defaults to 300ms).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * Hook that throttles high-frequency events (scroll/resize/mousemove) using requestAnimationFrame.
 * Prevents forced reflows and ensures execution at display refresh rate.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAnimationFrameThrottle<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
        rafIdRef.current = null;
      });
    },
    []
  );
}
