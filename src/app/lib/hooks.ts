'use client';
import { useEffect, useRef } from "react";

/** @returns {boolean} true if component is mounted, false otherwise */
export function useMounted(): boolean {
  const is = { mounted: false };
  const isMounted = useRef(is);

  useEffect(() => {
    if (isMounted.current.mounted === false) {
      isMounted.current.mounted = true;
    }
  }, []);

  return is.mounted;
}
