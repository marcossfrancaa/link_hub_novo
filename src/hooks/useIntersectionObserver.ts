import { useState, useEffect, useRef } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useRef<Element>(null);

  useEffect(() => {
    setElement(ref.current);
  }, []);

  useEffect(() => {
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element);
        observerRef.current.disconnect();
      }
    };
  }, [element, options.threshold, options.root, options.rootMargin]);

  return { ref, isIntersecting };
};