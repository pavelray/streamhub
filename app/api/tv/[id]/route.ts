import { TMDB_API_URL } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(
    `${TMDB_API_URL}/tv/${id}?api_key=${process.env.TMDB_API_KEY}&fields=id,name,number_of_seasons`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = await res.json();
  return NextResponse.json({ id: data.id, name: data.name, numberOfSeasons: data.number_of_seasons });
}
