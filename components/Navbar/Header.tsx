"use client";
import { useState } from "react";
import { Film, Tv, TrendingUp, Bookmark, Search, Layers } from "lucide-react";
import ThemeSwitchButton from "../ThemeSwitchButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWatchlistStore } from "@/utils/watchlistStore";

export default function Header({ isScrolled }: { isScrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  const navItems = [
    { name: "Movies", icon: Film, link: "/movie" },
    { name: "TV Shows", icon: Tv, link: "/tv" },
    { name: "Discover", icon: TrendingUp, link: "/discover" },
    { name: "Collections", icon: Layers, link: "/collections" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 sm:py-3 ${
        isScrolled || menuOpen ? "header-scrolled" : "header-default"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">

          {/* Logo — left */}
          <div className="flex-shrink-0">
            <h1
              className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent inline-block"
              style={{ backgroundImage: "var(--color-brand-gradient)" }}
            >
              <Link href="/">StreamHub</Link>
            </h1>
          </div>

          {/* Desktop Navigation — center */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-4">
            <div className="flex items-center space-x-1 xl:space-x-6">
              {navItems.map(({ name, icon: Icon, link }) => (
                <Link
                  key={name}
                  href={link}
                  className="group flex items-center gap-1.5 text-[var(--color-white)] hover:text-cyan-400 px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-300 relative whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-cyan-400 to-purple-400"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right — Search + Watchlist + Theme + Hamburger */}
          <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">

            {/* Inline search — only xl+ (1280px) has room alongside nav */}
            <form onSubmit={handleSearch} className="relative hidden xl:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2 pl-9 pr-4 text-sm text-[var(--color-white)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 w-48"
              />
            </form>

            {/* Search icon — at lg (1024-1279px) goes to /search page */}
            <Link
              href="/search"
              className="hidden lg:flex xl:hidden items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/watchlist"
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Watchlist"
            >
              <Bookmark className="w-4 h-4 text-white" />
              {watchlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: "var(--color-header-gradient)" }}
                >
                  {watchlistCount > 9 ? "9+" : watchlistCount}
                </span>
              )}
            </Link>

            <ThemeSwitchButton />

            {/* Hamburger — mobile and tablet (<lg) */}
            <button
              className="lg:hidden ml-1 p-2 rounded focus:outline-none"
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

        {/* Mobile/Tablet Menu (<lg) */}
        {menuOpen && (
          <div className="lg:hidden mt-2 pb-4 border-t border-white/10 pt-3">
            <div className="flex flex-col gap-1">
              {navItems.map(({ name, icon: Icon, link }) => (
                <Link
                  key={name}
                  href={link}
                  className="flex items-center gap-2 text-[var(--color-white)] hover:text-cyan-400 px-3 py-2.5 text-base font-medium transition-all duration-300 rounded-lg hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              ))}
              <Link
                href="/watchlist"
                className="flex items-center gap-2 text-[var(--color-white)] hover:text-cyan-400 px-3 py-2.5 text-base font-medium rounded-lg hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                <Bookmark className="w-5 h-5" />
                Watchlist {watchlistCount > 0 && `(${watchlistCount})`}
              </Link>
              <form onSubmit={handleSearch} className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-[var(--color-white)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 w-full"
                />
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
