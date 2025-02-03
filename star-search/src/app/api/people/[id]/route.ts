import { getPersonById } from "app/actions/peopleSearchAction";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const personId = (await params).id
    const person = await getPersonById(personId)

    return  NextResponse.json(person);
  }
