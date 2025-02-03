
import { getFilteredPeople, getPeopleByCharacterUrl } from "app/actions/peopleSearchAction";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    try {
        const people = await getFilteredPeople(search);
        return NextResponse.json(people);
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse("Error fetching people", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data || !data.characters || !Array.isArray(data.characters)) {
            return new NextResponse("Invalid request body. Expected { characters: string[] }", { status: 400 });
        }

        const people = await getPeopleByCharacterUrl(data.characters);
        return NextResponse.json(people);

    } catch (error) {
        console.error("Error in POST request:", error);
        return new NextResponse("Error processing request", { status: 500 });
    }
}