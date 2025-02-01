/**
 * @module utils
 * This module contains utility functions for working with data from the Star Wars API (SWAPI).
 */

/**
 * Extracts the object ID from a SWAPI URL.
 * The URL is expected to be in the format: `https://swapi.dev/api/{resource}/{id}/`
 *
 * @param {string} url - The SWAPI URL from which to extract the ID.
 *                       e.g., `https://swapi.dev/api/films/1/`, `https://swapi.dev/api/people/1/`
 * @returns {string} The object ID as a string.
 * @throws {TypeError} If the provided URL is not in the expected format.
 */
export const getObjectId = (url: string): string => {
    const baseUrl = process.env.SWAPI_URL || '';
    // Check if the URL is valid and in the expected format.  This is important for robustness.
    if (!url || typeof url !== 'string' || !url.startsWith(baseUrl)) {
        throw new TypeError("Invalid SWAPI URL format.  Expected 'https://swapi.dev/api/{resource}/{id}/'");
    }

    const parts = url.split("/");
    const id = parts[parts.length - 2]; // The numeric value (ID) is the second-to-last part

    // Additional check to make sure it's a number (or can be coerced to one).
    // Prevents unexpected behavior if the URL format changes in the future.
    if (isNaN(Number(id))) {
        throw new TypeError("Invalid SWAPI URL format.  ID is not a number.");
    }

    return id;
};