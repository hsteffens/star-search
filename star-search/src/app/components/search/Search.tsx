'use client';

import React, { useContext } from "react";
import styles from "./Search.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { SearchContext, SearchContextType } from "app/contexts/SearchContext";
import { getFilteredPeople } from "app/actions/peopleSearchAction";
import { getFilteredMovies } from "app/actions/moviesSearchAction";

type FormData = {
    searchText: string;
    searchingFor: string;
}

const Search: React.FC = () => {
    const { register, handleSubmit, watch } = useForm<FormData>({
        mode: "onChange",  // triggers validation on change
    });

    const { isLoading, setFilteredData, setIsPeopleData, setIsLoading } = useContext(SearchContext) as SearchContextType;

    const searchTextValue = watch('searchText'); // watch the input text value

    const onSubmit: SubmitHandler<FormData> = async data => {
        setIsLoading(true);
        if (data.searchingFor === 'People') {
            setFilteredData(await getFilteredPeople(data.searchText));
            setIsPeopleData(true);
        } else {
            setFilteredData(await getFilteredMovies(data.searchText));
            setIsPeopleData(false);
        }
        setIsLoading(false);
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.searchContainer}>
      <div>
        <span>
            What are you searching for?
        </span>
        
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              {...register('searchingFor')}
              value="People"
              defaultChecked
            />
            People
          </label>
          <label>
            <input
              type="radio"
              {...register('searchingFor')}
              value="Movies"
            />
            Movies
          </label>
        </div>

        <div className={styles.inputContainer}>
          <input
            id="searchText"
            type="text"
            placeholder="e.g. Chewbacca, Yoda, Boba Fett"
            {...register('searchText', { required: true })}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!searchTextValue}
        >
            <span>{isLoading ? 'SEARCHING...' : 'SEARCH'}</span>
        </button>
      </div>
    </form>
  );
}

export default Search;