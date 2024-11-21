'use client';
import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1440,
  hd: 1920,
};

const useScreen = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window?.innerWidth : 1920
  );

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWidth(window.innerWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const greater = (key) => width > breakpoints[key];

  return {
    breakpoints,
    isSm: greater('sm'),
    isMd: greater('md'),
    isLg: greater('lg'),
    isXl: greater('xl'),
    isHd: greater('hd'),
  };
};

export default useScreen;
