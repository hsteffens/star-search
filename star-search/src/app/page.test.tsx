import { render, screen } from '@testing-library/react';
import Home from './page';
import { SearchProvider } from './contexts/SearchContext';

jest.mock('./components/search/Search', () => {
    const MockedSearch = () => <div>Mocked Search</div>;
    MockedSearch.displayName = "Mocked Search Component";
    return MockedSearch;
});

jest.mock('./components/results/Results', () => {
    const MockedResults = () => <div>Mocked Results</div>;
    MockedResults.displayName = "Mocked Results Component";
    return MockedResults;
});


describe('Home Component', () => {
    it('renders the Search and Results components', () => {
        render(
            <SearchProvider>
                <Home />
            </SearchProvider>
        );

        // Check if the mocked components are rendered
        expect(screen.getByText('Mocked Search')).toBeInTheDocument();
        expect(screen.getByText('Mocked Results')).toBeInTheDocument();
    });

});