import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export const { clearProfileOrders } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;

export const selectProfileOrders = (state: {
  profileOrders: TProfileOrdersState;
}) => state.profileOrders.orders;

export const selectProfileOrdersLoading = (state: {
  profileOrders: TProfileOrdersState;
}) => state.profileOrders.isLoading;

export const selectProfileOrdersError = (state: {
  profileOrders: TProfileOrdersState;
}) => state.profileOrders.error;
