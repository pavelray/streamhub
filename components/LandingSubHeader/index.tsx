import { Play } from "lucide-react";

export const LandingSubHeader = () => {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto  p-10 rounded-xl">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent animate-pulse"
          style={{
            backgroundImage: "var(--color-brand-gradient)",
          }}
        >
          StreamHub
        </h1>

        <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
          Your gateway to unlimited entertainment. Discover trending movies,
          binge-worthy series, and rising stars all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="cursor-pointer group px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{
              background: "var(--color-header-gradient)",
            }}
          >
            <span className="flex items-center justify-center gap-2 text-[var(--color-white)]">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Start Watching
            </span>
          </button>

          <button className="cursor-pointer theme-switch px-8 py-3 rounded-full font-semibold transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
