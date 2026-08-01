"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersection<TElement extends Element>(
  options: UseIntersectionOptions = {}
): [React.RefObject<TElement | null>, boolean] {
  const { freezeOnceVisible = false, root, rootMargin, threshold } = options;
  const ref = useRef<TElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || (freezeOnceVisible && isIntersecting)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [freezeOnceVisible, isIntersecting, root, rootMargin, threshold]);

  return [ref, isIntersecting];
}
