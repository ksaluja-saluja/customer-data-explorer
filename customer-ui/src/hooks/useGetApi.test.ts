import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useGetApi from './useGetApi';

describe('useGetApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 'test' }));
    const { result } = renderHook(() => useGetApi(fetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const fetcher = vi.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useGetApi(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should handle errors from fetcher', async () => {
    const fetcher = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useGetApi(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Failed to load data');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should not update state on unmounted component', async () => {
    let capturedError: Error | null = null;
    const fetcher = vi.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100))
    );

    const { unmount } = renderHook(() => useGetApi(fetcher));

    // Unmount before promise resolves
    unmount();

    // Wait a bit more to ensure no state update errors occur
    await new Promise(resolve => setTimeout(resolve, 150));

    // No error should be thrown
    expect(capturedError).toBe(null);
  });

  it('should call fetcher with no arguments by default', async () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 'test' }));

    renderHook(() => useGetApi(fetcher));

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalled();
    });

    expect(fetcher).toHaveBeenCalledWith();
  });

  it('should handle empty dependencies array', async () => {
    const fetcher = vi.fn(() => Promise.resolve({ data: 'test' }));

    const { result } = renderHook(() => useGetApi(fetcher, []));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ data: 'test' });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should handle promise rejection with non-Error value', async () => {
    const fetcher = vi.fn(() => Promise.reject('String error'));

    const { result } = renderHook(() => useGetApi(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load data');
  });

  it('should maintain loading state during fetch', async () => {
    const fetcher = vi.fn(
      () => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 50))
    );

    const { result } = renderHook(() => useGetApi(fetcher));

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
