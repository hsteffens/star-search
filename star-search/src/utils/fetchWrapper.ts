/**
 * @module fetchWrapper
 * This module provides a utility function `fetchWrapper` for making HTTP requests
 * with retry logic using the `p-retry` library. It also tracks query statistics.
 */

"use server";

import pRetry from "p-retry";
import { trackQuery } from "./queryStats";

/**
 * Internal function to perform a single fetch request.  This function
 * is wrapped by `pRetry` in the `fetchWrapper` function.
 *
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options] - Optional fetch options (e.g., method, headers, body).
 * @returns {Promise<Response>} A promise that resolves to the Response object.
 * @throws {Error} If the response is not ok (status code not in the 200-299 range).
 */
const run = async (url: string, options?: RequestInit): Promise<Response> => {
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
};

/**
 * Fetches data from the given URL with retry logic.  Uses the `p-retry` library
 * to automatically retry failed fetch attempts.
 *
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options] - Optional fetch options (e.g., method, headers, body).
 * @returns {Promise<Response>} A promise that resolves to the Response object.
 */
export async function fetchWrapper(url: string, options?: RequestInit): Promise<Response> {
    return await pRetry(() => run(url, options), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : 3,
    });
}
