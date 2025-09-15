"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}>({
  theme: "default",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "default" ? "sunset" : "default");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
