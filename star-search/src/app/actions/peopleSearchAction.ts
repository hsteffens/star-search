/**
 * @module peopleSearchAction
 * This module contains server-side functions for fetching and processing data
 * related to people from the Star Wars API (SWAPI).
 */

"use server";

import { PeopleData, Person } from "app/types/people";
import { fetchWrapper } from "utils/fetchWrapper";

/**
 * Fetches a list of people from the SWAPI API, filtering by a search term.
 * This function handles pagination to retrieve all matching people across multiple API requests.
 *
 * @param {string} searchText - The search term to filter people by (optional).
 * @returns {Promise<PeopleData[]>} A promise that resolves to an array of PeopleData objects.
 */
export const getFilteredPeople = async (searchText: string): Promise<PeopleData[]> => {
  const baseUrl = process.env.SWAPI_URL;
  let people: PeopleData[] = [];
  let page = 1;
  let nextPage = true;

  while (nextPage) {
    try {
      const response = await fetchWrapper(
        `${baseUrl}people/?search=${searchText}&page=${page}`
      );
      const data = await response.json();

      people = people.concat(data.results);

      nextPage = data.next !== null;
      page += 1;
    } catch (error) {
      console.error('Error fetching people from API:', error);
      break; // Stop pagination if there's an error
    }
  }

  return people;
};

/**
 * Fetches a single person's data from the SWAPI API by their ID.
 *
 * @param {string} id - The ID of the person to fetch.
 * @returns {Promise<PeopleData | undefined>} A promise that resolves to a PeopleData object
 *                                           or undefined if an error occurs.
 */
export const getPersonById = async (id: string): Promise<Person | undefined> => {
  const baseUrl = process.env.SWAPI_URL;
  try {
    const response = await fetchWrapper(`${baseUrl}people/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching people from API:', error);
    return undefined; 
  }
};

/**
 * Fetches data for multiple people from the SWAPI API given an array of character URLs.
 * This function fetches data in parallel using `Promise.all`.
 *
 * @param {string[]} characterUrls - An array of character URLs.
 * @returns {Promise<PeopleData[]>} A promise that resolves to an array of PeopleData objects.
 *                              Returns an empty array if there's an error during fetching.
 */
export const getPeopleByCharacterUrl = async (characterUrls: string[]): Promise<PeopleData[]> => {
  try {
    const people = await Promise.all(
      characterUrls.map(async (url) => {
        try {
          const response = await fetchWrapper(url);
          if (response.ok) {
            return response.json();
          } else {
            console.error("Error fetching the person:", url);
          }
        } catch (error) {
          console.error("Error fetching person data:", error);
        }
        return null; // Explicitly return null for failed requests
      })
    );

    return people.filter(Boolean) as PeopleData[]; // Filter out null values from failed requests
  } catch (error) {
    console.error("Error fetching person data:", error);
    return []; // Return empty array on error
  }
};