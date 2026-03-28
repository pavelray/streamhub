import { BASE_IMAGE_URL, MOVIE_GENRES, TV_GENRES, APP_NAME, SITE_URL } from "@/utils/constants";
import { TMDB_API_URL } from "@/utils/constants";
import { notFound } from "next/navigation";
import { Calendar, ExternalLink, Film, Star, Tv, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import type { Metadata } from "next";

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  also_known_as: string[];
  combined_credits: {
    cast: CreditItem[];
    crew: CreditItem[];
  };
  images: { profiles: { file_path: string }[] };
}

interface CreditItem {
  id: number;
  title?: string;
  name?: string;
  character?: string;
  job?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  episode_count?: number;
}

const getPersonDetails = async (personId: string): Promise<PersonDetails | null> => {
  const apiKeyPresent = !!process.env.TMDB_API_KEY;
  console.log(`[Person] Fetching personId=${personId} | TMDB_API_KEY present=${apiKeyPresent}`);
  try {
    const res = await fetch(
      `${TMDB_API_URL}/person/${personId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=combined_credits,images`,
      { next: { revalidate: 86400 } }
    );
    console.log(`[Person] personId=${personId} status=${res.status}`);
    if (res.status === 404) {
      console.warn(`[Person] personId=${personId} not found on TMDB (404)`);
      return null;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Person] personId=${personId} FAILED status=${res.status} body=${body.slice(0, 200)}`);
      return null;
    }
    const data = await res.json();
    console.log(`[Person] personId=${personId} fetched OK name="${data.name}"`);
    return data;
  } catch (error) {
    console.error(`[Person] personId=${personId} exception:`, error);
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const personId = slugParts[slugParts.length - 1];
  const person = await getPersonDetails(personId);

  if (!person) {
    return { title: `Person | ${APP_NAME}` };
  }

  const ogImage = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : `${SITE_URL}/images/og-image.png`;

  const description = person.biography
    ? person.biography.slice(0, 200)
    : `Explore the filmography and profile of ${person.name} on ${APP_NAME}.`;

  return {
    title: person.name,
    description,
    keywords: `${person.name}, actor, actress, director, movies, tv series, streamhub`,
    openGraph: {
      title: person.name,
      description,
      type: "profile",
      url: `${SITE_URL}/person/${slug}`,
      locale: "en_US",
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 500, height: 750, alt: person.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: person.name,
      description,
      images: [ogImage],
    },
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const personId = slugParts[slugParts.length - 1];
  const person = await getPersonDetails(personId);

  if (!person) {
    notFound();
  }

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const age = person.birthday
    ? Math.floor(
        (new Date(person.deathday || Date.now()).getTime() -
          new Date(person.birthday).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  // Sort acting credits by popularity/date, deduplicate
  const actingCredits = (person.combined_credits?.cast || [])
    .filter((c) => c.poster_path)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .reduce<CreditItem[]>((acc, item) => {
      if (!acc.find((x) => x.id === item.id)) acc.push(item);
      return acc;
    }, []);

  const directorCredits = (person.combined_credits?.crew || [])
    .filter((c) => c.job === "Director" && c.poster_path)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .reduce<CreditItem[]>((acc, item) => {
      if (!acc.find((x) => x.id === item.id)) acc.push(item);
      return acc;
    }, []);

  const photos = (person.images?.profiles || []).slice(0, 10);

  return (
    <div className="min-h-screen mt-20 sm:mt-24">
      {/* Hero Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="md:w-48 lg:w-64 flex-shrink-0">
              <div className="glass-effect rounded-2xl p-4">
                {person.profile_path ? (
                  <Image
                    src={`${BASE_IMAGE_URL}/w500${person.profile_path}`}
                    alt={person.name}
                    width={400}
                    height={600}
                    className="w-full rounded-xl shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-24 h-24 text-white/30" />
                  </div>
                )}
              </div>

              {/* Personal Info sidebar */}
              <div className="mt-6 space-y-4">
                {person.known_for_department && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Known For</p>
                    <p className="text-white font-semibold">{person.known_for_department}</p>
                  </div>
                )}
                {person.birthday && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Born</p>
                    <p className="text-white text-sm">{formatDate(person.birthday)}</p>
                    {age && !person.deathday && (
                      <p className="text-gray-400 text-xs">({age} years old)</p>
                    )}
                  </div>
                )}
                {person.deathday && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Died</p>
                    <p className="text-white text-sm">{formatDate(person.deathday)}</p>
                    {age && <p className="text-gray-400 text-xs">(age {age})</p>}
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Place of Birth</p>
                    <p className="text-white text-sm">{person.place_of_birth}</p>
                  </div>
                )}
                {person.imdb_id && (
                  <a
                    href={`https://www.imdb.com/name/${person.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on IMDb
                  </a>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {person.name}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="text-yellow-400 font-bold">{person.popularity.toFixed(0)}</span>
                  <span className="text-gray-300 text-sm">Popularity</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 font-bold">{actingCredits.length}</span>
                  <span className="text-gray-300 text-sm">Credits</span>
                </div>
              </div>

              {/* Biography */}
              {person.biography && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Biography</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {person.biography}
                  </p>
                </div>
              )}

              {/* Also Known As */}
              {person.also_known_as && person.also_known_as.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">Also Known As</h2>
                  <div className="flex flex-wrap gap-2">
                    {person.also_known_as.slice(0, 6).map((name, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photos */}
      {photos.length > 1 && (
        <section className="py-8 px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl mb-8">Photos</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {photos.map((photo, i) => (
                <div key={i} className="flex-shrink-0 w-36 rounded-xl overflow-hidden">
                  <Image
                    src={`${BASE_IMAGE_URL}/w300${photo.file_path}`}
                    alt={`${person.name} photo ${i + 1}`}
                    width={150}
                    height={225}
                    className="rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Acting Credits */}
      {actingCredits.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <Film className="w-6 h-6 text-pink-400" />
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">Acting Credits</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {actingCredits.slice(0, 24).map((credit) => {
                const title = credit.title || credit.name || "Untitled";
                const href = credit.media_type === "tv"
                  ? `/tv/${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${credit.id}`
                  : `/movie/${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${credit.id}`;
                return (
                  <Link key={`${credit.id}-${credit.character}`} href={href} className="group block">
                    <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
                      <div className="relative aspect-[2/3] bg-white/5">
                        <Image
                          src={`${BASE_IMAGE_URL}/w200${credit.poster_path}`}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        {credit.media_type === "tv" && (
                          <div className="absolute top-2 left-2 p-1 rounded bg-purple-600/80">
                            <Tv className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {credit.vote_average > 0 && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/70">
                            <Star className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" />
                            <span className="text-yellow-400 text-xs">{credit.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-semibold truncate group-hover:text-cyan-300">{title}</p>
                        {credit.character && (
                          <p className="text-gray-500 text-xs truncate">{credit.character}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Director Credits */}
      {directorCredits.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <Film className="w-6 h-6 text-cyan-400" />
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">Directed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {directorCredits.slice(0, 16).map((credit) => {
                const title = credit.title || credit.name || "Untitled";
                const href = `/movie/${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${credit.id}`;
                return (
                  <Link key={credit.id} href={href} className="group block">
                    <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
                      <div className="relative aspect-[2/3] bg-white/5">
                        <Image
                          src={`${BASE_IMAGE_URL}/w200${credit.poster_path}`}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-semibold truncate group-hover:text-cyan-300">{title}</p>
                        <p className="text-gray-500 text-xs">{(credit.release_date || credit.first_air_date || "").slice(0, 4)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
