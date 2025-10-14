import { CastMember, CrewMember } from "@/lib/MovieDetails";
import { TMDB_API_URL } from "@/utils/constants";
import { castAndCrewDataTransformer } from "@/utils/dataTransformer";
import { ArrowRight, TrendingUp, User } from "lucide-react";

interface CastAndCrewType {
  id: number;
  cast?: CastMember[];
  crew?: CrewMember[];
}

const append_to_response = "language=en-US";

const getMovieCastAndCrewData = async (
  movieId: string
): Promise<CastAndCrewType | null> => {
  try {
    const url = `${TMDB_API_URL}/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}&append_to_response=${append_to_response}`;
    const castAndCrewRes = await fetch(
      url,
      { next: { revalidate: 86400 } } // Revalidate every 24 hours
    );

    if (!castAndCrewRes.ok) {
      console.error("Failed to fetch castAndCrew details");
      return null;
    }

    const castAndCrewData = await castAndCrewRes.json();
    const castAndCrew = castAndCrewDataTransformer(castAndCrewData);
    return castAndCrew;
  } catch (error) {
    console.error("Error fetching castAndCrew details:", error);
    return null;
  }
};

const CastAndCrewPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const castAndCrew = await getMovieCastAndCrewData(slug);

  if (!castAndCrew) {
    return (
      <div className="text-center text-white">
        Cast And Crew details not found
      </div>
    );
  }
  return (
    <div className="min-h-screen mt-24">
      <div className="container mx-auto">
        {/* Cast Section */}
        <section className="py-16 px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title text-4xl lg:text-5xl">Cast</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {castAndCrew.cast?.map((member, index) => (
              <div
                key={`cast-${member.id}-${index}`}
                className="group relative flex-shrink-0 w-40 md:w-48"
              >
                {/* Card container */}
                <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 overflow-hidden cursor-pointer">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  {/* Image container */}
                  <div className="relative w-full h-48 md:h-56 overflow-hidden">
                    {/* Image or fallback */}
                    {member.profilePath ? (
                      <img
                        src={member.profilePath}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/40 to-blue-500/40">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-white/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Popularity badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-500/95 to-blue-500/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg z-20">
                      <TrendingUp className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="text-white font-bold text-xs whitespace-nowrap">
                        {member.popularity.toFixed(1)}
                      </span>
                    </div>

                    {/* Glass reflection effect */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
                  </div>
                  <div className="relative z-10 p-3 md:p-4">
                    <h2
                      className="text-sm md:text-base font-bold text-white mb-1 leading-tight truncate"
                      title={member.name}
                    >
                      {member.name}
                    </h2>
                    <p
                      className="text-purple-200 font-medium text-xs md:text-sm leading-tight line-clamp-2"
                      title={member.character}
                    >
                      as {member.character}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="py-16 px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title text-4xl lg:text-5xl">Crew</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {castAndCrew.crew?.map((member, index) => (
              <div
                key={`crew-${member.id}-${index}`}
                className="group relative flex-shrink-0 w-40 md:w-48"
              >
                {/* Card container */}
                <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 overflow-hidden cursor-pointer">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  {/* Image container */}
                  <div className="relative w-full h-48 md:h-56 overflow-hidden">
                    {/* Image or fallback */}
                    {member.profilePath ? (
                      <img
                        src={member.profilePath}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/40 to-blue-500/40">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-white/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Popularity badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-500/95 to-blue-500/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg z-20">
                      <TrendingUp className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="text-white font-bold text-xs whitespace-nowrap">
                        {member.popularity.toFixed(1)}
                      </span>
                    </div>

                    {/* Glass reflection effect */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
                  </div>
                  <div className="relative z-10 p-3 md:p-4">
                    <h2
                      className="text-sm md:text-base font-bold text-white mb-1 leading-tight truncate"
                      title={member.name}
                    >
                      {member.name}
                    </h2>
                    <p
                      className="text-purple-200 font-medium text-xs md:text-sm leading-tight line-clamp-2"
                      title={member.job}
                    >
                      as {member.job}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CastAndCrewPage;
