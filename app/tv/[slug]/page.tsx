// import React from 'react'

// const TvDetailsPage = async ({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) => {
//   const { slug } = await params;
//   return (
//     <div>
//       This is TV show page {slug}
//     </div>
//   )
// }

// export default TvDetailsPage
"use client";
import React, { useState } from 'react';
import { Play, Star, Calendar, Clock, Film, Users, ChevronRight, Lock } from 'lucide-react';

interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  isPaid: boolean;
  overview: string;
  airDate: string;
}

interface Season {
  id: number;
  number: number;
  episodes: Episode[];
  episodeCount: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  image: string;
}

interface SeriesDetails {
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  releaseYear: string;
  genres: string[];
  overview: string;
  totalSeasons: number;
  status: string;
  network: string;
}

const TVSeriesDetailsPage: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Mock data - replace with your API data
  const seriesDetails: SeriesDetails = {
    title: "Cosmic Chronicles",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
    rating: 8.7,
    releaseYear: "2023",
    genres: ["Sci-Fi", "Drama", "Thriller"],
    overview: "An epic journey through space and time, where humanity's fate hangs in the balance. Follow the crew of the Stellar Phoenix as they navigate through uncharted territories, facing unprecedented challenges and discovering the true meaning of exploration.",
    totalSeasons: 3,
    status: "Ongoing",
    network: "StreamHub Originals"
  };

  const cast: CastMember[] = [
    { id: 1, name: "Emma Stone", character: "Captain Sarah Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { id: 2, name: "John Davis", character: "Dr. Marcus Webb", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { id: 3, name: "Lisa Wang", character: "Engineer Maya Rodriguez", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { id: 4, name: "Michael Torres", character: "Commander Jack Ryan", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { id: 5, name: "Sarah Kim", character: "Dr. Yuki Tanaka", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
    { id: 6, name: "David Chen", character: "Pilot Alex Martinez", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
    { id: 7, name: "Rachel Green", character: "Scientist Emma Wilson", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop" }
  ];

  const seasons: Season[] = [
    {
      id: 1,
      number: 1,
      episodeCount: 10,
      episodes: [
        {
          id: 1,
          number: 1,
          title: "New Horizons",
          duration: "52 min",
          thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=170&fit=crop",
          isPaid: false,
          overview: "The crew embarks on their first mission beyond the solar system.",
          airDate: "2023-01-15"
        },
        {
          id: 2,
          number: 2,
          title: "The Dark Nebula",
          duration: "48 min",
          thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "A mysterious signal leads them into uncharted territory.",
          airDate: "2023-01-22"
        },
        {
          id: 3,
          number: 3,
          title: "First Contact",
          duration: "55 min",
          thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "The crew encounters their first alien civilization.",
          airDate: "2023-01-29"
        },
        {
          id: 4,
          number: 4,
          title: "Quantum Paradox",
          duration: "50 min",
          thumbnail: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "Time becomes unstable as they approach a black hole.",
          airDate: "2023-02-05"
        }
      ]
    },
    {
      id: 2,
      number: 2,
      episodeCount: 12,
      episodes: [
        {
          id: 11,
          number: 1,
          title: "Return Journey",
          duration: "50 min",
          thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "The crew begins their journey back to Earth with new discoveries.",
          airDate: "2023-09-10"
        },
        {
          id: 12,
          number: 2,
          title: "Betrayal",
          duration: "53 min",
          thumbnail: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "A crew member's secret threatens the entire mission.",
          airDate: "2023-09-17"
        }
      ]
    },
    {
      id: 3,
      number: 3,
      episodeCount: 8,
      episodes: [
        {
          id: 21,
          number: 1,
          title: "The Final Frontier",
          duration: "55 min",
          thumbnail: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=170&fit=crop",
          isPaid: true,
          overview: "The ultimate challenge awaits as they reach the edge of the known universe.",
          airDate: "2024-03-01"
        }
      ]
    }
  ];

  const currentSeason = seasons.find(s => s.number === selectedSeason) || seasons[0];

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${seriesDetails.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-from)] via-[var(--color-bg-from)]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-from)] via-transparent to-[var(--color-bg-from)]/50"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img 
                src={seriesDetails.poster} 
                alt={seriesDetails.title}
                className="w-64 h-96 object-cover rounded-xl shadow-2xl glass-effect"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="inline-block mb-2">
                <span className="px-4 py-1 rounded-full text-sm font-semibold glass-effect">
                  {seriesDetails.network}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 section-title">
                {seriesDetails.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{seriesDetails.rating}</span>
                </div>
                <span>•</span>
                <span>{seriesDetails.releaseYear}</span>
                <span>•</span>
                <span>{seriesDetails.totalSeasons} Seasons</span>
                <span>•</span>
                <span className="px-3 py-1 rounded-full glass-effect text-xs">
                  {seriesDetails.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {seriesDetails.genres.map((genre, index) => (
                  <span key={index} className="genre-chip">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-lg text-[var(--color-text-secondary)] mb-6 max-w-3xl">
                {seriesDetails.overview}
              </p>

              <div className="flex gap-4">
                <button className="watch-btn px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: 'var(--color-movie-gradient)' }}>
                  <Play className="w-5 h-5" />
                  Watch Now
                </button>
                <button className="trailer-btn px-8 py-3 rounded-full font-semibold flex items-center gap-2 glass-effect transition-all hover:scale-105">
                  <Film className="w-5 h-5" />
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Crew Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 section-title">Cast & Crew</h2>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {cast.map((member) => (
            <div 
              key={member.id}
              className="flex-shrink-0 text-center group cursor-pointer"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 glass-effect ring-2 ring-transparent group-hover:ring-[var(--color-blob-cyan)] transition-all duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="font-semibold text-sm mb-1">{member.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{member.character}</p>
            </div>
          ))}
          
          {/* View All Circle */}
          <div className="flex-shrink-0 text-center group cursor-pointer">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full mb-3 glass-effect flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs font-semibold">View All</p>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">Full Cast</p>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 section-title">Episodes</h2>

        {/* Season Selector */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => handleSeasonChange(season.number)}
              className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                selectedSeason === season.number
                  ? 'glass-effect ring-2 ring-[var(--color-blob-cyan)]'
                  : 'glass-effect hover:bg-white/20'
              }`}
            >
              Season {season.number}
              <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                ({season.episodeCount} episodes)
              </span>
            </button>
          ))}
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSeason.episodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => handleEpisodeClick(episode)}
              className="video-item rounded-xl overflow-hidden cursor-pointer group"
            >
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {episode.isPaid && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                    {episode.duration}
                  </div>
                </div>

                {/* Episode Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg group-hover:text-[var(--color-blob-cyan)] transition-colors">
                      {episode.number}. {episode.title}
                    </h3>
                    {episode.isPaid && (
                      <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'var(--color-movie-gradient)' }}>
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {episode.airDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {episode.duration}
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {episode.overview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Episode Payment Modal */}
      {selectedEpisode && selectedEpisode.isPaid && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEpisode(null)}>
          <div className="glass-effect rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full glass-effect flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Episode</h3>
              <p className="text-[var(--color-text-secondary)]">
                {selectedEpisode.title}
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass-effect rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--color-text-secondary)]">Episode Price</span>
                  <span className="text-2xl font-bold">$2.99</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Watch unlimited times after purchase
                </p>
              </div>

              <button className="w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{ background: 'var(--color-movie-gradient)' }}>
                <Play className="w-5 h-5" />
                Purchase & Watch
              </button>

              <button 
                onClick={() => setSelectedEpisode(null)}
                className="w-full py-3 rounded-full glass-effect hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TVSeriesDetailsPage;
