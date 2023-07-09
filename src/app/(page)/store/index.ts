import { configureStore } from '@reduxjs/toolkit';
import { chatSlice } from './slices/chatSlice';
import { configSlice } from './slices/configSlice';

export const store = configureStore({
  reducer: {
    [chatSlice.name]: chatSlice.reducer,
    [configSlice.name]: configSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
