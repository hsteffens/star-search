import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import MovieDetails from './page';
import { getPeopleByCharacterUrl } from '../../actions/peopleSearchAction';
import { getMovieById } from '../../actions/moviesSearchAction';
import { Movie } from 'app/types/movies';
import { PeopleData } from 'app/types/people';
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
    getPeopleByCharacterUrl: jest.fn(),
}));

jest.mock('../../actions/moviesSearchAction', () => ({
    getMovieById: jest.fn(),
}));

jest.mock('../../../utils/helper', () => ({
    getObjectId: (url: string) => url.split('/').pop(), // Mock getObjectId
}));


describe('MovieDetails Page', () => {
    const mockRouterPush = jest.fn();
    const mockUseRouter = jest.fn(() => ({
        push: mockRouterPush,
    }));

    beforeEach(() => {
        (useRouter as jest.Mock).mockImplementation(mockUseRouter);
        (getMovieById as jest.Mock).mockClear();
        (getPeopleByCharacterUrl as jest.Mock).mockClear();
    });


    it('fetches and displays movie details and characters', async () => {
        const mockMovie: Movie = {
            title: 'A New Hope',
            opening_crawl: 'A long time ago...',
            characters: ['https://swapi.dev/api/people/1/'],
        };
        const mockPeople: PeopleData[] = [{ name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' }];

        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getMovieById as jest.Mock).mockResolvedValue(mockMovie);
        (getPeopleByCharacterUrl as jest.Mock).mockResolvedValue(mockPeople);

        render(<MovieDetails />);

        await waitFor(() => {
            expect(screen.getByText('A New Hope')).toBeInTheDocument();
            expect(screen.getByText('A long time ago...')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Characters' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Luke Skywalker,' })).toBeInTheDocument();
        });
    });

    it('handles errors during fetch', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getMovieById as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<MovieDetails />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching movie details:', new Error('Failed to fetch'));
        });

        consoleErrorMock.mockRestore();
    });

    it('navigates back to search', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        render(<MovieDetails />);

        const backButton = screen.getByRole('button', { name: 'BACK TO SEARCH' });
        fireEvent.click(backButton);

        expect(mockRouterPush).toHaveBeenCalledWith('/');
    });

    it('renders correctly with no characters', async () => {
        const mockMovie: Movie = {
            title: 'A New Hope',
            opening_crawl: 'A long time ago...',
            characters: [],
        };

        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        (getMovieById as jest.Mock).mockResolvedValue(mockMovie);

        render(<MovieDetails />);

        await waitFor(() => {
            expect(screen.getByText('A New Hope')).toBeInTheDocument();
            expect(screen.getByText('A long time ago...')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Characters' })).toBeInTheDocument();
            // Check that there are no character links
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });
    });
});