"use client";

import React, { useContext } from "react";
import styles from "./Results.module.css";
import { SearchContext, SearchContextType } from "app/contexts/SearchContext";
import Table from "../table/Table";
import { PeopleData } from "app/types/people";
import { MovieData } from "app/types/movies";
import { useRouter } from "next/navigation";
import { getObjectId } from "utils/helper";


const Results: React.FC = () => {
    const { isLoading, filteredData, isPeopleData } = useContext(SearchContext) as SearchContextType;
    const router = useRouter();

    const navigateToDetails = (id: string) => {
      if (isPeopleData) {
        router.push(`/person-details/${id}`);
      } else {
        router.push(`/movie-details/${id}`);
      }
    }

    let tableResults;
    if (filteredData && filteredData.length > 0) {
        const data = filteredData.map((result) => {
            if (isPeopleData) {
              const people = result as PeopleData;
              return { name: people.name, id: getObjectId(people.url) }
            } else {
              const movie = result as MovieData;
              return { name: movie.title, id: getObjectId(movie.url) }
            }
        });
        tableResults = (
          <Table data={data} onButtonClick={navigateToDetails} />
        )
        
        filteredData.map((result, index) => (
            <div key={index}>
              <h3>{JSON.stringify(result)}</h3>
            </div>
        ));
    } else if (isLoading) {
        tableResults = (<span className={styles.noMatchResults}>Searching...</span>);
    } else {
      tableResults = (
          <span className={styles.noMatchResults}>
              There are zero matches.<br />
              Use the form to search for People or Movies.
          </span>
      );
  }

    return (
      <div className={styles.resultsContainer}>
        <span className={`${styles.resultsTitle} Text-Style`}>Results</span>
        <div className={styles.resultRetangle}> </div>
        {tableResults}
      </div>
    );
};

export default Results;