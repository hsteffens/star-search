import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';

describe('Table Component', () => {
    it('renders the table with correct data', () => {
        const data = [
            { name: 'Luke Skywalker', id: '1' },
            { name: 'Darth Vader', id: '4' },
        ];

        render(<Table data={data} onButtonClick={() => { }} />);

        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
        expect(screen.getByText('Darth Vader')).toBeInTheDocument();
        expect(screen.getAllByText('SEE DETAILS').length).toBe(2); // Check for both buttons
    });

    it('calls onButtonClick with the correct id', () => {
        const data = [{ name: 'Luke Skywalker', id: '1' }];
        const mockOnButtonClick = jest.fn();

        render(<Table data={data} onButtonClick={mockOnButtonClick} />);

        const button = screen.getByText('SEE DETAILS');
        fireEvent.click(button);

        expect(mockOnButtonClick).toHaveBeenCalledWith('1');
    });

    it('renders an empty table if no data is provided', () => {
        render(<Table data={[]} onButtonClick={() => { }} />);

        const rows = screen.queryAllByRole('row'); // Query to avoid errors if no rows
        expect(rows.length).toBe(0);
    });

    it('applies correct styles', () => {
        const data = [{ name: 'Luke Skywalker', id: '1' }];
        render(<Table data={data} onButtonClick={() => { }} />);

        const table = screen.getByRole('table');
        const row = screen.getByRole('row');
        const nameCell = screen.getByText('Luke Skywalker');
        const button = screen.getByText('SEE DETAILS');

        expect(table).toHaveClass('tableContainer');
        expect(row).toHaveClass('tableRow');
        expect(nameCell).toHaveClass('tableColumnName');
        expect(button).toHaveClass('tableColumnActionLabel');
    });
});
