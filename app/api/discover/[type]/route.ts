import { TMDB_API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;
  const tmdbParams = new URLSearchParams();
  tmdbParams.set("api_key", process.env.TMDB_API_KEY!);

  // Forward all allowed filter params
  const allowed = [
    "sort_by", "page", "with_genres", "vote_average.gte", "vote_average.lte",
    "with_runtime.lte", "with_runtime.gte", "with_watch_providers", "watch_region",
    "with_original_language", "release_date.gte", "release_date.lte",
    "first_air_date.gte", "first_air_date.lte", "vote_count.gte",
    "with_keywords", "without_genres",
  ];

  for (const key of allowed) {
    const val = searchParams.get(key);
    if (val) tmdbParams.set(key, val);
  }

  const url = `${TMDB_API_URL}/discover/${type}?${tmdbParams.toString()}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return NextResponse.json({ error: "TMDB error" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json({
    results: data.results,
    total_pages: Math.min(data.total_pages, 50),
    total_results: data.total_results,
    page: data.page,
  });
}
