export {};

declare global {
  interface QueryStats {
    [key: string]: number;
  }

  interface QueryTimings {
    [key: string]: number[];
  }

  var queryStats: QueryStats;
  var queryTimings: QueryTimings;
}
