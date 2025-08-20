import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';

type TOrderDetailsState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

export const initialState: TOrderDetailsState = {
  order: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0];
    }
    throw new Error('Order not found');
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order details';
      });
  }
});

export const selectOrderDetails = (state: {
  orderDetails: TOrderDetailsState;
}) => state.orderDetails.order;

export const selectOrderDetailsLoading = (state: {
  orderDetails: TOrderDetailsState;
}) => state.orderDetails.loading;

export const selectOrderDetailsError = (state: {
  orderDetails: TOrderDetailsState;
}) => state.orderDetails.error;

export const { clearOrderDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
