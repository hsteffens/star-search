import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import styles from './Layout.module.css';

describe('Layout Component', () => {
  it('renders the children within the main element', () => {
    const testContent = <p>Test Content</p>;
    render(<Layout>{testContent}</Layout>);

    // Check if the test content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Verify it's within the main element
    const mainElement = screen.getByRole('main'); // Use role for better semantics
    expect(mainElement).toContainElement(screen.getByText('Test Content'));
  });

  it('renders the banner with the correct text and styles', () => {
    render(<Layout><div></div></Layout>);

    const banner = screen.getByText('SWStarter');

    // Check if the banner text is correct
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass(styles.banner);  // Check if the banner class is applied
    expect(banner).toHaveClass('Text-Style-2'); // Check if the additional class is applied
  });

  it('renders the header', () => {
    render(<Layout><div></div></Layout>);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(styles.header);
  });
});
