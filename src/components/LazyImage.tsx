import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string;
  threshold?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'https://via.placeholder.com/150',
  threshold = 0.1,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, threshold]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setImgSrc(placeholder);
        setIsLoading(false);
      };
    }
  }, [isInView, src, placeholder]);

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`${className || ''} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      {...props}
    />
  );
};