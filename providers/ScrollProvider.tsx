"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ScrollContextType {
  isScrolled: boolean;
  scrollY: number;
}

const ScrollContext = createContext<ScrollContextType>({
  isScrolled: false,
  scrollY: 0,
});

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

interface ScrollProviderProps {
  children: ReactNode;
  threshold?: number; // Scroll threshold to trigger isScrolled
}

export function ScrollProvider({
  children,
  threshold = 50,
}: ScrollProviderProps) {
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    scrollY: 0,
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrollState({
            isScrolled: scrollY > threshold,
            scrollY,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial scroll state
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return (
    <ScrollContext.Provider value={scrollState}>
      {children}
    </ScrollContext.Provider>
  );
}
