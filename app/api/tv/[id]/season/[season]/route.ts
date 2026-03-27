import { TMDB_API_URL } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season } = await params;
  const res = await fetch(
    `${TMDB_API_URL}/tv/${id}/season/${season}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = await res.json();
  return NextResponse.json({
    season_number: data.season_number,
    name: data.name,
    episode_count: data.episodes?.length || 0,
    episodes: (data.episodes || []).map((e: any) => ({
      episode_number: e.episode_number,
      name: e.name,
      overview: e.overview,
      still_path: e.still_path,
      air_date: e.air_date,
      runtime: e.runtime,
    })),
  });
}
