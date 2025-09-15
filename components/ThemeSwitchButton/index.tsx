"use client";
import { useTheme } from "@/theme/ThemeContext";
import { useState, useEffect } from "react";

// Icons for theme switching
const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ThemeSwitchButton() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />;
  }

  const isDefault = theme === "default";

  return (
    <button
      onClick={toggleTheme}
      className="theme-switch group relative flex items-center justify-center w-12 h-12 rounded-full font-medium text-sm shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/20"
      aria-label={`Switch to ${isDefault ? "Sunset" : "Default"} Theme`}
      title={`Switch to ${isDefault ? "Sunset" : "Default"} Theme`}
    >
      {/* Icon with smooth transition */}
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {isDefault ? <SunIcon /> : <MoonIcon />}
      </div>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 ease-out" />

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}

// Alternative: Text-based theme switcher
export function TextThemeSwitchButton() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-24 h-10 rounded-lg bg-gray-200 animate-pulse" />;
  }

  const isDefault = theme === "default";

  return (
    <button
      onClick={toggleTheme}
      className="theme-switch group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/20 transition-all duration-300"
      aria-label={`Switch to ${isDefault ? "Sunset" : "Default"} Theme`}
    >
      {/* Icon */}
      <div className="transition-transform duration-300 group-hover:scale-110">
        {isDefault ? <SunIcon /> : <MoonIcon />}
      </div>

      {/* Text */}
      <span className="text-sm font-medium">
        {isDefault ? "Sunset" : "Default"}
      </span>

      {/* Background glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
