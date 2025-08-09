import { configureStore, combineReducers } from '@reduxjs/toolkit';
import burgerReducer from './slices/burger-slice';
import userReducer from './slices/user-slice';
import feedsReducer from './slices/feeds-slice';
import profileOrdersReducer from './slices/order-slice';
import orderDetailsReducer from './slices/order-details-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  burger: burgerReducer,
  user: userReducer,
  feeds: feedsReducer,
  profileOrders: profileOrdersReducer,
  orderDetails: orderDetailsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
