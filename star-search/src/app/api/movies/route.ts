import { getFilteredMovies, getMoviesByFilmUrl } from "app/actions/moviesSearchAction";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    try {
        const movies = await getFilteredMovies(search);
        return NextResponse.json(movies);
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse("Error fetching movies", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data || !data.films || !Array.isArray(data.films)) {
            return new NextResponse("Invalid request body. Expected { films: string[] }", { status: 400 });
        }

        const movies = await getMoviesByFilmUrl(data.films);
        return NextResponse.json(movies);

    } catch (error) {
        console.error("Error in POST request:", error);
        return new NextResponse("Error processing request", { status: 500 });
    }
}