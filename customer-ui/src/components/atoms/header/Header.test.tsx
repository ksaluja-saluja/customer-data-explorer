import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('should render the header element', () => {
    render(<Header title="Test Title" />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeTruthy();
  });

  it('should have the correct CSS class name', () => {
    render(<Header title="Test Title" />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement.className).toBe('app-header');
  });

  it('should display the provided title', () => {
    const testTitle = 'Customer Data Explorer';
    render(<Header title={testTitle} />);
    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeTruthy();
  });

  it('should render the header title as an h1', () => {
    const testTitle = 'My App Title';
    render(<Header title={testTitle} />);
    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(h1Element.textContent).toBe(testTitle);
  });

  it('should contain the React logo image', () => {
    render(<Header title="Test Title" />);
    const logoImage = screen.getByAltText('React logo');
    expect(logoImage).toBeTruthy();
    expect(logoImage.className).toBe('header-logo');
  });

  it('should render header brand container', () => {
    const { container } = render(<Header title="Test Title" />);
    const brandDiv = container.querySelector('.header-brand');
    expect(brandDiv).toBeTruthy();
  });

  it('should have header-title class on the h1', () => {
    render(<Header title="Test Title" />);
    const h1Element = screen.getByRole('heading', { level: 1 });
    expect(h1Element.className).toBe('header-title');
  });
});
