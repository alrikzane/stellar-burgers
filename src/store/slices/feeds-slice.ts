import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  isLoading: boolean;
  error: string | null;
  data: TOrdersData;
};

export const initialState: TFeedsState = {
  isLoading: true,
  error: null,
  data: {
    orders: [],
    total: NaN,
    totalToday: NaN
  }
};

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feeds/fetch',
  async () => await getFeedsApi()
);

const slice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        console.log('pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        console.log('fulfilled');
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error on getting feeds';
      });
  }
});

export default slice.reducer;
