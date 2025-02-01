import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import PersonDetails from './page';
import { getPersonById } from '../../actions/peopleSearchAction';
import { getMoviesByFilmUrl } from '../../actions/moviesSearchAction';
import { Person } from 'app/types/people';
import { MovieData } from 'app/types/movies';
import { ReactNode } from 'react';

type LinkProps = {
    children: ReactNode;
    href: string;
};


jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
    Link: ({ children, href }: LinkProps) => <a href={href}>{children}</a>, // Mock Link
}));

jest.mock('../../actions/peopleSearchAction', () => ({
    getPersonById: jest.fn(),
}));

jest.mock('../../actions/moviesSearchAction', () => ({
    getMoviesByFilmUrl: jest.fn(),
}));

jest.mock('../../../utils/helper', () => ({
    getObjectId: (url: string) => url.split('/').pop(), // Mock getObjectId
}));


describe('PersonDetails Page', () => {
    const mockRouterPush = jest.fn();
    const mockUseRouter = jest.fn(() => ({
        push: mockRouterPush,
    }));

    beforeEach(() => {
        (useRouter as jest.Mock).mockImplementation(mockUseRouter);
        (getPersonById as jest.Mock).mockClear();
        (getMoviesByFilmUrl as jest.Mock).mockClear();
    });

    it('fetches and displays person details and movies', async () => {
        const mockPerson: Person = {
            name: 'Luke Skywalker',
            birth_year: '19BBY',
            gender: 'Male',
            eye_color: 'Blue',
            hair_color: 'Blond',
            mass: '77',
            height: '172',
            films: ['https://swapi.dev/api/films/1/'],
        };
        const mockMovies: MovieData[] = [{ title: 'A New Hope', url: 'https://swapi.dev/api/films/1/' }];

        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getPersonById as jest.Mock).mockResolvedValue(mockPerson);
        (getMoviesByFilmUrl as jest.Mock).mockResolvedValue(mockMovies);

        render(<PersonDetails />);

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
            expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
            expect(screen.getByText('Gender: Male')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'A New Hope,' })).toBeInTheDocument();
        });
    });

    it('handles errors during fetch', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getPersonById as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<PersonDetails />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching person details:', new Error('Failed to fetch'));
        });

        consoleErrorMock.mockRestore();
    });

    it('navigates back to search', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        render(<PersonDetails />);

        const backButton = screen.getByRole('button', { name: 'BACK TO SEARCH' });
        fireEvent.click(backButton);

        expect(mockRouterPush).toHaveBeenCalledWith('/');
    });

    it('renders correctly with no movies', async () => {
        const mockPerson: Person = {
            name: 'Luke Skywalker',
            birth_year: '19BBY',
            gender: 'Male',
            eye_color: 'Blue',
            hair_color: 'Blond',
            mass: '77',
            height: '172',
            films: [],
        };

        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getPersonById as jest.Mock).mockResolvedValue(mockPerson);

        render(<PersonDetails />);

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
            expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
            expect(screen.getByText('Gender: Male')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument();
            // Check that there are no movie links
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });
    });
});