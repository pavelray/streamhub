"use client";

import { Loader2, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface MoodResult {
  type: "movie" | "tv";
  genre: string;
  sortBy: string;
  minRating: string;
  moodLabel: string;
  description: string;
}

const MOOD_CHIPS = [
  { label: "😂 Make me laugh", value: "something funny and hilarious to make me laugh out loud" },
  { label: "😱 Scare me", value: "terrifying horror that will keep me up at night" },
  { label: "💕 Date night", value: "a romantic movie for a date night" },
  { label: "🌧️ Rainy day cozy", value: "cozy comfort movie for a rainy day at home" },
  { label: "🤯 Mind-bending", value: "mind-bending thriller with unexpected plot twists" },
  { label: "🚀 Epic adventure", value: "epic adventure with stunning action sequences" },
  { label: "😢 Cry my eyes out", value: "deeply emotional and moving drama that will make me cry" },
  { label: "🧠 Intelligent", value: "smart thought-provoking film with deep storytelling" },
];

export default function MoodSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (moodText: string) => {
    const trimmed = moodText.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mood-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      const result: MoodResult = await res.json();

      const params = new URLSearchParams({
        type: result.type,
        sortBy: result.sortBy,
        moodLabel: result.moodLabel,
        moodDesc: result.description,
      });
      if (result.genre) params.set("genre", result.genre);
      if (result.minRating) params.set("minRating", result.minRating);

      router.push(`/discover?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyse mood. Try again.");
      setLoading(false);
    }
  };

  const handleChip = (value: string) => {
    setMood(value);
    handleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(mood);
  };

  return (
    <section className="w-full px-6 lg:px-8 max-w-4xl mx-auto mb-12">
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles
            className="w-5 h-5"
            style={{ color: "var(--color-blob-cyan)" }}
          />
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-blob-cyan)" }}
          >
            AI Mood Search
          </span>
          <Sparkles
            className="w-5 h-5"
            style={{ color: "var(--color-blob-cyan)" }}
          />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
          How are you feeling?
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Describe your mood and our AI will find the perfect watch for you
        </p>
      </div>

      {/* Input row */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "something cozy for a rainy night" or "hyped action thriller"'
            maxLength={300}
            disabled={loading}
            className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm disabled:opacity-60"
          />
          {mood && !loading && (
            <button
              onClick={() => setMood("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => handleSearch(mood)}
          disabled={!mood.trim() || loading}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          style={{ background: "var(--color-header-gradient)" }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? "Thinking…" : "Find"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Mood chips */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {MOOD_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChip(chip.value)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/80 hover:bg-white/20 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}
