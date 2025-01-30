"use server";

import { PeopleData } from "app/types/people";

export const getFilteredPeople = async (searchText: string) => {
  const baseUrl = process.env.SWAPI_URL;
  let people: PeopleData[] = [];
  let page = 1;
  let nextPage = true;

  while (nextPage) {
    try {
      const response = await fetch(
        `${baseUrl}people/?search=${searchText}&page=${page}`
      );
      const data = await response.json();

      people = people.concat(data.results); // Add the results to the people array

      // Check if there is a next page
      nextPage = data.next !== null;
      page += 1;
    } catch (error) {
      console.error('Error fetching people from API:', error);
      break; // Stop if there's an error
    }
  }

  return people;
};


export const getPersonById = async (id: string) => {
  const baseUrl = process.env.SWAPI_URL;
  try {
    const response = await fetch(
      `${baseUrl}people/${id}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching people from API:', error);

  }
}

export const getPeopleByCharacterUrl = async (characterUrls: string[]) => {
  const people: PeopleData[] = [];

  for (const url of characterUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const personData = await response.json();
        people.push(personData);
      } else {
        console.error('Error fetching the person:', url);
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
    }
  }

  return people;
}