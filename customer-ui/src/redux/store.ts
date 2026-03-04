import { configureStore } from '@reduxjs/toolkit';
import customerPageReducer from './slices/customerPageSlice';

export const store = configureStore({
  reducer: {
    customerPage: customerPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
