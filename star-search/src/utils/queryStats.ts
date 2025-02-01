/**
 * @module queryStats
 * This module provides functions for tracking and analyzing query statistics,
 * including query counts and average request timings. It uses `globalThis`
 * to persist state across server requests.
 */

/**
 * These objects are attached to `globalThis` to persist data across server requests.
 */
globalThis.queryStats = globalThis.queryStats || {};
globalThis.queryTimings = globalThis.queryTimings || {};

/**
 * Tracks a query and its request duration.  Increments the query count and
 * stores the duration for calculating average timings.
 *
 * @param {string} query - The query string.
 * @param {number} duration - The duration of the query in milliseconds.
 */
export function trackQuery(query: string, duration: number): void {
  // Track query count. If the query hasn't been seen before, initialize to 0.
  globalThis.queryStats[query] = (globalThis.queryStats[query] || 0) + 1;

  // Track query timings. Initialize an empty array if the query hasn't been seen.
  if (!globalThis.queryTimings[query]) {
    globalThis.queryTimings[query] = [];
  }
  globalThis.queryTimings[query].push(duration);
}

/**
 * Returns the top queries by count, sorted in descending order.
 *
 * @param {number} [limit=5] - The maximum number of top queries to return.
 * @returns {Array<{ query: string; count: number; }>} An array of objects,
 *                                                    each containing the query and its count.
 */
export function getTopQueries(limit: number = 5): Array<{ query: string; count: number; }> {
  return Object.entries(globalThis.queryStats) // Convert queryStats object to an array of [query, count] entries.
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order.
    .slice(0, limit) // Limit the number of results.
    .map(([query, count]) => ({ query, count })); // Map the entries to objects.
}

/**
 * Calculates and returns the average request timing for each query.
 *
 * @returns {{ [query: string]: number; }} An object where keys are queries and values are
 *                                          the average request timing in milliseconds.
 */
export function getAverageRequestTimingPerQuery(): { [query: string]: number; } {
  const avgTimings: { [query: string]: number } = {};

  for (const query in globalThis.queryTimings) {
    const timings = globalThis.queryTimings[query];
    if (timings.length > 0) {
      avgTimings[query] =
        timings.reduce((sum, t) => sum + t, 0) / timings.length; // Calculate the average.
    }
  }

  return avgTimings;
}
