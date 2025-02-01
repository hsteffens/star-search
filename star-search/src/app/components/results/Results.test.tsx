import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Results from './Results';
import { SearchContext, SearchContextType } from 'app/contexts/SearchContext';
import { PeopleData } from 'app/types/people'
import { MovieData } from 'app/types/movies';
import { useRouter } from 'next/navigation';
import { TableProps } from '../table/Table';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../table/Table', () => {
  return {
    __esModule: true,
    default: ({ data, onButtonClick }: TableProps) => (
      <table>
        <tbody>
          {data.map((item: { name: string; id: string }) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <button onClick={() => onButtonClick(item.id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  };
});

jest.mock('../../../utils/helper', () => ({
  getObjectId: (url: string) => url.split('/').pop(), // Mock getObjectId
}));


describe('Results Component', () => {
  const mockRouterPush = jest.fn();
  const mockUseRouter = jest.fn(() => ({
    push: mockRouterPush,
  }));

  const resultsComponent = (context: SearchContextType) => (
    <SearchContext.Provider value={{ ...context }}>
      <Results />
    </SearchContext.Provider>
  );

  const defaultContextValues = {
    isLoading: false, filteredData: [], isPeopleData: true,
    setFilteredData: () => { },
    setIsPeopleData: () => { },
    setIsLoading: () => { },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(mockUseRouter);
  });


  it('renders loading state', () => {
    render(resultsComponent({ ...defaultContextValues, isLoading: true }));
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('renders no matches message', () => {
    render(resultsComponent({ ...defaultContextValues }));
    expect(screen.getByText('There are zero matches.', { exact: false })).toBeInTheDocument();
  });

  it('renders people data in the table', () => {
    const peopleData: PeopleData[] = [
      { name: 'Luke Potato', url: 'https://swapi.dev/api/people/11/' },
      { name: 'Darth Rice', url: 'https://swapi.dev/api/people/12/' },
    ];

    render(resultsComponent({ ...defaultContextValues, filteredData: peopleData }));

    expect(screen.getByRole('table')).toBeInTheDocument(); // Check if table exists
    expect(screen.getByText('Luke Potato')).toBeInTheDocument();
    expect(screen.getByText('Darth Rice')).toBeInTheDocument();
  });


  it('navigates to person details page', async () => {
    const peopleData: PeopleData[] = [
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
    ];

    render(resultsComponent({ ...defaultContextValues, filteredData: peopleData }));

    const detailsButton = screen.getByRole('button');
    detailsButton.click();

    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/person-details/'));
  });

  it('navigates to movie details page', async () => {
    const movieData: MovieData[] = [
      { title: 'A New Hope', url: 'https://swapi.dev/api/films/1/' },
    ];

    render(resultsComponent({ ...defaultContextValues, filteredData: movieData, isPeopleData: false }));

    const detailsButton = screen.getByRole('button');
    detailsButton.click();

    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/movie-details/'));
  });

  it('renders movie data in the table', () => {
    const movieData: MovieData[] = [
      { title: 'A New Hope', url: 'https://swapi.dev/api/films/1/' },
      { title: 'The Empire Strikes Back', url: 'https://swapi.dev/api/films/2/' },
    ];

    render(resultsComponent({ ...defaultContextValues, filteredData: movieData, isPeopleData: false }));

    expect(screen.getByRole('table')).toBeInTheDocument(); // Check if table exists
    expect(screen.getByText('A New Hope')).toBeInTheDocument();
    expect(screen.getByText('The Empire Strikes Back')).toBeInTheDocument();
  });
});
