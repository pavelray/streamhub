"use client";
import { useState } from "react";
import { Film, Tv, TrendingUp, User, Search } from 'lucide-react'; // adjust as necessary
import ThemeSwitchButton from "../ThemeSwitchButton"; // as per previous instructions
import { link } from "fs";
import Link from "next/link";

export default function Header({ isScrolled }: { isScrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Movies", icon: Film, link: "/movies" },
    { name: "TV Series", icon: Tv, link: "/tv-series" },
    { name: "Discover", icon: TrendingUp, link: "/discover" },
    { name: "About", icon: User, link: "/about" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 ${
        isScrolled ? 'header-scrolled' : 'header-default'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1
              className="text-2xl font-bold bg-clip-text text-transparent inline-block"
              style={{ backgroundImage: "var(--color-brand-gradient)" }}
            >
              <Link href="/">StreamHub</Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map(({ name, icon: Icon }) => (
                <a
                  key={name}
                  href={`#${name.toLowerCase().replace(" ", "-")}`}
                  className="group flex items-center gap-2 text-[var(--color-white)] hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-all duration-300 relative"
                >
                  <Icon className="w-4 h-4" />
                  {name}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-clip-text text-transparent group-hover:w-full transition-all duration-300 bg-gradient-to-r from-cyan-400 to-purple-400"
                    style={{
                      backgroundImage: "var(--color-header-gradient)",
                    }}
                  ></span>
                </a>
              ))}
            </div>
          </div>

          {/* Search bar + Theme Switch */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-[var(--color-white)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 w-64"
              />
            </div>
            {/* Theme switch button */}
            <ThemeSwitchButton />
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-2 p-2 rounded focus:outline-none"
              onClick={() => setMenuOpen((x) => !x)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col gap-1">
              {navItems.map(({ name, icon: Icon }) => (
                <a
                  key={name}
                  href={`#${name.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center gap-2 text-[var(--color-white)] hover:text-cyan-400 px-3 py-2 text-base font-medium transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </a>
              ))}
              {/* Search bar in mobile menu */}
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-[var(--color-white)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 w-full"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
