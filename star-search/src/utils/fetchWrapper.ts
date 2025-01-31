"use server";

import pRetry from "p-retry";
import { trackQuery } from "./queryStats";

const run = async (url: string, options?: RequestInit) => {
    const start = Date.now();
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error fetch ${url}: ${response.statusText}`);
        }
        const duration = Date.now() - start;
        trackQuery(url, duration);

        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export async function fetchWrapper(url: string, options?: RequestInit) {
    return await pRetry(() => run(url, options), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : 3,
    });
}

