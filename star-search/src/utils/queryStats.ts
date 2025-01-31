// Ensure global state persists across requests
globalThis.queryStats = globalThis.queryStats || {};
globalThis.queryTimings = globalThis.queryTimings || {};

/**
 * Tracks a query and its request duration.
 */
export function trackQuery(query: string, duration: number) {
  // Track query count
  globalThis.queryStats[query] = (globalThis.queryStats[query] || 0) + 1;

  // Track query timings
  if (!globalThis.queryTimings[query]) {
    globalThis.queryTimings[query] = [];
  }
  globalThis.queryTimings[query].push(duration);
}

/**
 * Returns the top queries by count.
 */
export function getTopQueries(limit = 5) {
  return Object.entries(globalThis.queryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([query, count]) => ({ query, count }));
}

/**
 * Returns the average request timing per query.
 */
export function getAverageRequestTimingPerQuery() {
  const avgTimings: { [query: string]: number } = {};

  for (const query in globalThis.queryTimings) {
    const timings = globalThis.queryTimings[query];
    if (timings.length > 0) {
      avgTimings[query] =
        timings.reduce((sum, t) => sum + t, 0) / timings.length;
    }
  }

  return avgTimings;
}
