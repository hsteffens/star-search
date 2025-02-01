import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';
import { SearchContext, SearchContextType } from 'app/contexts/SearchContext';
import { getFilteredPeople } from '../../actions/peopleSearchAction';
import { getFilteredMovies } from '../../actions/moviesSearchAction';


jest.mock('../../actions/peopleSearchAction', () => ({
  getFilteredPeople: jest.fn(),
}));

jest.mock('../../actions/moviesSearchAction', () => ({
  getFilteredMovies: jest.fn(),
}));

describe('Search Component', () => {
  const mockSetFilteredData = jest.fn();
  const mockSetIsPeopleData = jest.fn();
  const mockSetIsLoading = jest.fn();

  const searchComponent = (context: SearchContextType) => (
    <SearchContext.Provider value={{ ...context }} >
      <Search />
    </SearchContext.Provider>
  );

  const defaultContextValues = {
    isLoading: false, filteredData: [], isPeopleData: true,
    setFilteredData: mockSetFilteredData,
    setIsPeopleData: mockSetIsPeopleData,
    setIsLoading: mockSetIsLoading,
  };


  beforeEach(() => {
    (getFilteredPeople as jest.Mock).mockClear();
    (getFilteredMovies as jest.Mock).mockClear();
    mockSetFilteredData.mockClear();
    mockSetIsPeopleData.mockClear();
    mockSetIsLoading.mockClear();
  });

  it('renders the form correctly', () => {
    render(searchComponent({ ...defaultContextValues }));

    expect(screen.getByText('What are you searching for?')).toBeInTheDocument();
    expect(screen.getByLabelText('People')).toBeInTheDocument();
    expect(screen.getByLabelText('Movies')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SEARCH' })).toBeInTheDocument(); // More robust query
  });

  it('calls getFilteredPeople and updates state on people search', async () => {
    const mockPeopleData = [{ name: 'Luke Skywalker' }];
    (getFilteredPeople as jest.Mock).mockResolvedValue(mockPeopleData);

    render(searchComponent({ ...defaultContextValues }));

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), {
      target: { value: 'Luke' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SEARCH' }));

    await waitFor(() => {
      expect(getFilteredPeople).toHaveBeenCalledWith('Luke');
      expect(mockSetFilteredData).toHaveBeenCalledWith(mockPeopleData);
      expect(mockSetIsPeopleData).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it('calls getFilteredMovies and updates state on movie search', async () => {
    const mockMovieData = [{ title: 'A New Hope' }];
    (getFilteredMovies as jest.Mock).mockResolvedValue(mockMovieData);

    render(searchComponent({ ...defaultContextValues }));

    fireEvent.click(screen.getByLabelText('Movies')); // Select Movies radio button
    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), {
      target: { value: 'A New Hope' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SEARCH' }));

    await waitFor(() => {
      expect(getFilteredMovies).toHaveBeenCalledWith('A New Hope');
      expect(mockSetFilteredData).toHaveBeenCalledWith(mockMovieData);
      expect(mockSetIsPeopleData).toHaveBeenCalledWith(false);
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it('disables the search button when input is empty', () => {
    render(searchComponent({ ...defaultContextValues }));

    expect(screen.getByRole('button', { name: 'SEARCH' })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), {
      target: { value: 'test' },
    });
    expect(screen.getByRole('button', { name: 'SEARCH' })).not.toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('e.g. Chewbacca, Yoda, Boba Fett'), {
      target: { value: '' },
    });
    expect(screen.getByRole('button', { name: 'SEARCH' })).toBeDisabled();
  });

  it('displays loading state while searching', async () => {
    render(searchComponent({ ...defaultContextValues, isLoading: true }));

    expect(screen.getByRole('button', { name: 'SEARCHING...' })).toBeInTheDocument();
  });
});
