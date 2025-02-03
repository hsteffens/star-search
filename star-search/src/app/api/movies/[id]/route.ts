import { getMovieById } from "app/actions/moviesSearchAction";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const movieId = (await params).id
    const movie = await getMovieById(movieId)

    return NextResponse.json(movie)
  }
