import { NextResponse } from "next/server";
import { getAverageRequestTimingPerQuery, getTopQueries } from "utils/queryStats";

export async function GET() {
  return NextResponse.json({
    topQueries: getTopQueries(),
    averageRequestTiming: getAverageRequestTimingPerQuery(),
  });
}
