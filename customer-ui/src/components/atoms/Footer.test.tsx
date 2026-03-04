import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('should render the footer element', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeTruthy();
  });

  it('should have the correct CSS class name', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement.className).toBe('app-footer');
  });

  it('should display the copyright text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© 2026 Customer Data Explorer/);
    expect(copyrightText).toBeTruthy();
  });

  it('should contain the complete copyright message', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement.textContent).toBe(
      '© 2026 Customer Data Explorer. All rights reserved.'
    );
  });

  it('should render as a footer element', () => {
    const { container } = render(<Footer />);
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeTruthy();
  });
});
