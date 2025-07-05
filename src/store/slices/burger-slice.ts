import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { getIngredientsApi, orderBurgerApi } from '@api';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

type TBurgerState = {
  ingredients: {
    data: TIngredient[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  };
  constructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  order: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    data: TOrder | null;
  };
};

const initialState: TBurgerState = {
  ingredients: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null
  },
  constructor: {
    bun: null,
    ingredients: []
  },
  order: {
    status: 'idle',
    data: null
  }
};

export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  async () => await getIngredientsApi()
);

export const createOrder = createAsyncThunk(
  'burger/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructor.bun = action.payload;
        } else {
          state.constructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: {
      reducer: (state, action: PayloadAction<{ from: number; to: number }>) => {
        const { from, to } = action.payload;
        const [moved] = state.constructor.ingredients.splice(from, 1);
        state.constructor.ingredients.splice(to, 0, moved);
      },
      prepare: (from: number, to: number) => ({
        payload: { from, to }
      })
    },
    clearConstructor: (state) => {
      state.constructor.bun = null;
      state.constructor.ingredients = [];
    },
    resetIngredients: (state) => {
      state.ingredients = initialState.ingredients;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchIngredients.pending, (state) => {
        state.ingredients.loading = true;
        state.ingredients.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients.loading = false;
        state.ingredients.data = action.payload;
        state.ingredients.lastFetched = Date.now();
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.ingredients.loading = false;
        state.ingredients.error = action.error.message || 'Fetch failed';
      })

      .addCase(createOrder.pending, (state) => {
        state.order.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order.status = 'succeeded';
        state.order.data = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.order.status = 'failed';
      });
  }
});

export const selectAllIngredients = (state: { burger: TBurgerState }) =>
  state.burger.ingredients.data;

export const selectIngredientsLoading = (state: { burger: TBurgerState }) =>
  state.burger.ingredients.loading;

export const selectConstructorState = (state: { burger: TBurgerState }) =>
  state.burger.constructor;

export const selectOrderState = (state: { burger: TBurgerState }) =>
  state.burger.order;

export const selectAvailableBuns = createSelector(
  [selectAllIngredients],
  (ingredients) => ingredients.filter((item) => item.type === 'bun')
);

export const selectDefaultBun = createSelector(
  [selectAvailableBuns],
  (buns) => buns[0] || null
);

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  resetIngredients
} = burgerSlice.actions;

export default burgerSlice.reducer;
