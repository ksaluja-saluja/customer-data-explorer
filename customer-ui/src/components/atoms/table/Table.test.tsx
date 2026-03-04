import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Table from './Table';

interface TestData {
  id: number;
  name: string;
  email: string;
  age: number;
}

describe('Table Component', () => {
  const mockData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ];

  it('should render a table element', () => {
    const { container } = render(
      <Table columns={['id', 'name', 'email']} data={mockData} />
    );
    const table = container.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('should render table headers from columns prop', () => {
    render(<Table columns={['id', 'name', 'email']} data={mockData} />);
    
    expect(screen.getByText('id')).toBeTruthy();
    expect(screen.getByText('name')).toBeTruthy();
    expect(screen.getByText('email')).toBeTruthy();
  });

  it('should render all data rows', () => {
    render(
      <Table columns={['id', 'name', 'email']} data={mockData} />
    );
    
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
    expect(screen.getByText('Bob Johnson')).toBeTruthy();
  });

  it('should render all data cells', () => {
    render(
      <Table columns={['id', 'name', 'email']} data={mockData} />
    );
    
    expect(screen.getByText('john@example.com')).toBeTruthy();
    expect(screen.getByText('jane@example.com')).toBeTruthy();
    expect(screen.getByText('bob@example.com')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Table 
        columns={['id', 'name', 'email']} 
        data={mockData}
        className="custom-table"
      />
    );
    const table = container.querySelector('table');
    expect(table?.className).toBe('custom-table');
  });

  it('should handle null and undefined values with dash', () => {
    const dataWithNulls: TestData[] = [
      { id: 1, name: 'John Doe', email: null as any, age: 30 },
      { id: 2, name: 'Jane Smith', email: undefined as any, age: 28 },
    ];
    
    const { container } = render(
      <Table columns={['id', 'name', 'email']} data={dataWithNulls} />
    );
    
    const cells = container.querySelectorAll('td');
    // Find cells that contain "-"
    const dashCells = Array.from(cells).filter(cell => cell.textContent === '-');
    expect(dashCells.length).toBeGreaterThanOrEqual(2);
  });

  it('should render numeric values as strings', () => {
    render(
      <Table columns={['id', 'age']} data={mockData} />
    );
    
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('30')).toBeTruthy();
  });

  it('should handle empty data array', () => {
    const { container } = render(
      <Table columns={['id', 'name', 'email']} data={[]} />
    );
    
    const tbody = container.querySelector('tbody');
    expect(tbody?.children.length).toBe(0);
  });

  it('should use id key by default', () => {
    const { container } = render(
      <Table columns={['id', 'name']} data={mockData} />
    );
    
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should use custom idKey prop', () => {
    interface CustomIdData {
      customId: number;
      name: string;
    }
    
    const customData: CustomIdData[] = [
      { customId: 100, name: 'Test' },
    ];
    
    const { container } = render(
      <Table 
        columns={['customId', 'name']} 
        data={customData}
        idKey="customId"
      />
    );
    
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
  });

  it('should have proper table structure with thead and tbody', () => {
    const { container } = render(
      <Table columns={['id', 'name']} data={mockData} />
    );
    
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');
    
    expect(thead).toBeTruthy();
    expect(tbody).toBeTruthy();
  });

  it('should render correct number of header cells', () => {
    const { container } = render(
      <Table columns={['id', 'name', 'email', 'age']} data={mockData} />
    );
    
    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells.length).toBe(4);
  });

  it('should render correct number of data cells per row', () => {
    const { container } = render(
      <Table columns={['id', 'name', 'email']} data={mockData} />
    );
    
    const rows = container.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      expect(cells.length).toBe(3);
    });
  });

  it('should only display specified columns', () => {
    const { container } = render(
      <Table columns={['id', 'name']} data={mockData} />
    );
    
    // Should have id and name columns only (no email or age)
    expect(screen.getByText('id')).toBeTruthy();
    expect(screen.getByText('name')).toBeTruthy();
    expect(screen.queryByText('email')).toBeFalsy();
    expect(screen.queryByText('age')).toBeFalsy();
  });
});
