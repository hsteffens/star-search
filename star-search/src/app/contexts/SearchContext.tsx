"use client"

import { MovieData } from 'app/types/movies';
import { PeopleData } from 'app/types/people';
import React, { createContext, useState, ReactNode } from 'react';

export type SearchContextType = {
  filteredData: PeopleData[] | MovieData[];
  isPeopleData: boolean;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<PeopleData[] | MovieData[]>>;
  setIsPeopleData: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filteredData, setFilteredData] = useState<PeopleData[] | MovieData[]>([]);
  const [isPeopleData, setIsPeopleData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SearchContext.Provider value={{ filteredData, isPeopleData, isLoading, setFilteredData, setIsPeopleData, setIsLoading }}>
      {children}
    </SearchContext.Provider>
  );
};
