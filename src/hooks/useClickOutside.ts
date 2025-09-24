import { useEffect, RefObject } from 'react';

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // Verificar se o clique foi fora do elemento
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};