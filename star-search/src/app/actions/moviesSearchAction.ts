"use server";

import { MovieData } from "app/types/movies";
import { fetchWrapper } from "utils/fetchWrapper";

export const getFilteredMovies = async (searchText: string) => {
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
  
        movies = movies.concat(data.results); // Add the results to the movies array
  
        // Check if there is a next page
        nextPage = data.next !== null;
        page += 1;
      } catch (error) {
        console.error('Error fetching movies from API:', error);
        break; // Stop if there's an error
      }
    }
  
    return movies;
};

export const getMoviesByFilmUrl = async (filmUrls: string[]) => {
  const films: MovieData[] = [];

  for (const url of filmUrls) {
    try {
      const response = await fetchWrapper(url);
      if (response.ok) {
        const filmData = await response.json();
        films.push(filmData);
      } else {
        console.error('Error fetching the film:', url);
      }
    } catch (error) {
      console.error('Error fetching film data:', error);
    }
  }

  return films;
}

export const getMovieById = async (id: string) => {
  const baseUrl = process.env.SWAPI_URL;
  try {
    const response = await fetchWrapper(
      `${baseUrl}films/${id}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching people from API:', error);

  }
}

