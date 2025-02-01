"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getPersonById } from "app/actions/peopleSearchAction";
import { useEffect, useState } from "react";
import { Person } from "app/types/people";
import { MovieData } from "app/types/movies";
import { getMoviesByFilmUrl } from "app/actions/moviesSearchAction";
import Link from "next/link";
import { getObjectId } from "utils/helper";


export default function PersonDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [person, setPerson] = useState<Person>({
    name: "",
    birth_year: "",
    gender: "",
    eye_color: "",
    hair_color: "",
    mass: "",
    height: "",
    films: [],
  });

  const [movies, setMovies] = useState<MovieData[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchPersonDetails = async () => {
      try {
        const personData = await getPersonById(id as string);
        setPerson(personData);

        // etch movie data based on person films
        if (personData.films && personData.films.length > 0) {
          const movieDescriptions = await getMoviesByFilmUrl(personData.films);
          setMovies(movieDescriptions);
        }
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };

    fetchPersonDetails();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.characterDetails}>
        <span className={styles.containerTitle}>{person.name}</span>
        
        {/* Wrapper ensures sections are stacked vertically */}
        <div className={styles.sectionsWrapper}>
          <div className={styles.section}>
            <h2>Details</h2>
            <div className={styles.rectangle}> </div>
            <p>Birth Year: {person.birth_year}</p>
            <p>Gender: {person.gender}</p>
            <p>Eye Color: {person.eye_color}</p>
            <p>Hair Color: {person.hair_color}</p>
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
            <button className={styles.backButton} onClick={() => router.push('/')}>
              <span className={styles.backButtonLabel}>BACK TO SEARCH</span>
            </button>
          </div>
          <div className={styles.section}>
            <h2>Movies</h2>
            <div className={styles.rectangle}> </div>
            {
              movies.map((movie, index) => (
                <Link key={index} href={`/movie-details/${getObjectId(movie.url)}`}>
                  {movie.title},
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );  
}
