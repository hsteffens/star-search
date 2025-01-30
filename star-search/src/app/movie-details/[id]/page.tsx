"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getPeopleByCharacterUrl } from "app/actions/peopleSearchAction";
import { useEffect, useState } from "react";
import { PeopleData } from "app/types/people";
import { Movie } from "app/types/movies";
import { getMovieById } from "app/actions/moveisSearchAction";
import Link from "next/link";
import { getObjectId } from "utils/helper";


export default function MovieDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [movie, setMovie] = useState<Movie>({
    title: "",
    opening_crawl: "",
    characters: [],
  });

  const [characters, setCharacters] = useState<PeopleData[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        const movieData = await getMovieById(id as string);
        setMovie(movieData);

        // etch movie data based on person films
        if (movieData.characters && movieData.characters.length > 0) {
          const people = await getPeopleByCharacterUrl(movieData.characters);
          setCharacters(people);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.characterDetails}>
        <span className={styles.containerTitle}>{movie.title}</span>
        
        {/* Wrapper ensures sections are stacked vertically */}
        <div className={styles.sectionsWrapper}>
          <div className={styles.section}>
            <h2>Opening Crawl</h2>
            <div className={styles.rectangle}> </div>
            <p>{movie.opening_crawl}</p>
            <button className={styles.backButton} onClick={() => router.push('/')}>
              <span className={styles.backButtonLabel}>BACK TO SEARCH</span>
            </button>
          </div>
          <div className={styles.section}>
            <h2>Characters</h2>
            <div className={styles.rectangle}> </div>
            {
              characters.map((person, index) => (
                <Link key={index} href={`/person-details/${getObjectId(person.url)}`}>
                  {person.name},
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );  
}
