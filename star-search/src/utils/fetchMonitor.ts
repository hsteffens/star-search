"use server";

import { trackQuery } from "./queryStats";

export async function fetchWrapper(url: string, options?: RequestInit) {
    const start = Date.now();
    try {
        const response = await fetch(url, options);
        const duration = Date.now() - start;
        trackQuery(url, duration);

        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

