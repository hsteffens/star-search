/**
 * @module moviesSearchAction
 * This module contains server-side functions for fetching and processing data
 * related to movies from the Star Wars API (SWAPI).
 */

"use server";

import { MovieData } from "app/types/movies";
import { fetchWrapper } from "utils/fetchWrapper";

/**
 * Fetches a list of movies from the SWAPI API, optionally filtered by a search term.
 * This function handles pagination to retrieve all matching movies across multiple API requests.
 *
 * @param {string} searchText - The search term to filter movies by (optional).
 * @returns {Promise<MovieData[]>} A promise that resolves to an array of MovieData objects.
 */
export const getFilteredMovies = async (searchText: string): Promise<MovieData[]> => {
  const baseUrl = process.env.SWAPI_URL;
  let movies: MovieData[] = [];
  let page = 1;
  let nextPage = true;

  while (nextPage) {
    try {
      const response = await fetchWrapper(
        `${baseUrl}films/?search=${searchText}&page=${page}`
      );
      const data = await response.json();

      movies = movies.concat(data.results);

      nextPage = data.next !== null;
      page += 1;
    } catch (error) {
      console.error('Error fetching movies from API:', error);
      break; // Stop pagination if there's an error
    }
  }

  return movies;
};

/**
 * Fetches data for multiple movies from the SWAPI API given an array of film URLs.
 * This function fetches data in parallel using `Promise.all`.
 *
 * @param {string[]} filmUrls - An array of film URLs.
 * @returns {Promise<MovieData[]>} A promise that resolves to an array of MovieData objects.
 *                              Returns an empty array if there's an error during fetching.
 */
export const getMoviesByFilmUrl = async (filmUrls: string[]): Promise<MovieData[]> => {
  try {
    const films = await Promise.all(
      filmUrls.map(async (url) => {
        try {
          const response = await fetchWrapper(url);
          if (response.ok) {
            return response.json();
          } else {
            console.error("Error fetching the film:", url);
          }
        } catch (error) {
          console.error("Error fetching film data:", error);
        }
        return null; // Explicitly return null for failed requests
      })
    );

    return films.filter(Boolean) as MovieData[]; // Filter out null values from failed requests
  } catch (error) {
    console.error("Error fetching film data:", error);
    return []; // Return empty array on error
  }
};

/**
 * Fetches a single movie's data from the SWAPI API by its ID.
 *
 * @param {string} id - The ID of the movie to fetch.
 * @returns {Promise<MovieData | undefined>} A promise that resolves to a MovieData object
 *                                           or undefined if an error occurs.
 */
export const getMovieById = async (id: string): Promise<MovieData | undefined> => {
  const baseUrl = process.env.SWAPI_URL;
  try {
    const response = await fetchWrapper(`${baseUrl}films/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie from API:', error);
    return undefined;
  }
};
