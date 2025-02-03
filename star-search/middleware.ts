import { NextResponse } from 'next/server';

export function middleware() {
    const response = NextResponse.next();

    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

    return response;
}

export const config = {
    matcher: '/api/:path*',
}