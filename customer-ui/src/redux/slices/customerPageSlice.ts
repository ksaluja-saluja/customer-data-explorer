import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getCustomerPageAPI } from '../../api/CustomerPageAPI';
import type { CustomerPageResponse } from '../../api/CustomerPageAPI';

//TODO: Consider using a more robust state management using Tanstack Query for better caching and server state management, especially as the app grows in complexity
interface CustomerPageState {
  pages: Record<string, CustomerPageResponse>;
  loading: boolean;
  error: string | null;
  currentPage: {
    start: number;
    max: number;
  };
}

const initialState: CustomerPageState = {
  pages: {},
  loading: false,
  error: null,
  currentPage: {
    start: 0,
    max: 10,
  },
};

// Thunk to fetch customer page data
export const getCustomerPage = createAsyncThunk(
  'customerPage/getPage',
  async (
    { start, max }: { start: number; max: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { customerPage: CustomerPageState };
    const cacheKey = `${start}-${max}`;
    const cachedPage = state.customerPage.pages[cacheKey];

    // Return cached data if it exists, no API call needed
    if (cachedPage) {
      return { data: cachedPage, fromCache: true };
    }

    try {
      const data = await getCustomerPageAPI(start, max);
      return { data, fromCache: false };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch customer data'
      );
    }
  }
);

const customerPageSlice = createSlice({
  name: 'customerPage',
  initialState,
  reducers: {
    clearCache: (state) => {
      state.pages = {};
    },
    invalidatePagesAfter: (state, action: PayloadAction<number>) => {
      const startIndex = action.payload;
      const keysToDelete: string[] = [];

      Object.entries(state.pages).forEach(([key]) => {
        const [start] = key.split('-').map(Number);
        if (start >= startIndex) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => delete state.pages[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerPage.fulfilled, (state, action) => {
        const { start, max } = action.meta.arg;
        const cacheKey = `${start}-${max}`;

        state.pages[cacheKey] = action.payload.data;

        state.currentPage = { start, max };
        state.loading = false;
        state.error = null;
      })
      .addCase(getCustomerPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCache, invalidatePagesAfter } = customerPageSlice.actions;

export default customerPageSlice.reducer;
