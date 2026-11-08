import { useRef, useEffect } from "react";

/**
 * Dev-only hook to count component render occurrences.
 * Returns the current render count without triggering additional re-renders.
 */
export function useRenderCount(componentName?: string): number {
  const count = useRef(1);

  useEffect(() => {
    count.current += 1;
    if (process.env.NODE_ENV !== "production" && componentName) {
      // Dev log for render verification
      // console.debug(`[RenderCount] ${componentName}: ${count.current}`);
    }
  });

  // Reading the ref during render is intentional here: this dev-only counter
  // must report the current render without scheduling an extra one.
  // eslint-disable-next-line react-hooks/refs
  return count.current;
}
