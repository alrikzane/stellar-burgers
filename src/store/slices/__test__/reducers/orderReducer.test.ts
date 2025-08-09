import profileOrdersReducer, {
  initialState,
  fetchProfileOrders,
  clearProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError
} from '../../order-slice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
  _id: '100000',
  status: 'done',
  name: 'Заказ 10000 кратонский бургер',
  createdAt: '2025-09-08',
  updatedAt: '2025-09-08',
  number: 10000,
  ingredients: ['ingredient1', 'ingredient2']
  },
  {
  _id: '100001',
  status: 'done',
  name: 'Заказ 10001 кратонский бургер',
  createdAt: '2025-09-08',
  updatedAt: '2025-09-08',
  number: 10001,
  ingredients: ['ingredient1', 'ingredient3']
  }
];

describe('Тестируем order-slice', () => {
  it('Должен возвращать initial state', () => {
    const state = profileOrdersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Должен обрабатывать clearProfileOrders', () => {
    const stateWithOrders = {
      ...initialState,
      orders: mockOrders,
      error: 'error'
    };
    const state = profileOrdersReducer(stateWithOrders, clearProfileOrders());
    expect(state.orders).toEqual([]);
    expect(state.error).toBe('error'); 
  });

  describe('Тестируем fetchProfileOrders', () => {
    it('Должен обрабатывать pending', () => {
      const action = { type: fetchProfileOrders.pending.type };
      const state = profileOrdersReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должен обрабатывать fulfilled', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('Должен обрабатывать rejected', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchProfileOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = profileOrdersReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });
  });

  describe('Тестируем селекторы', () => {
    const testState = {
      profileOrders: {
        orders: mockOrders,
        isLoading: true,
        error: null
      }
    };

    it('selectProfileOrders должен возвращать мок-заказы', () => {
      expect(selectProfileOrders(testState)).toEqual(mockOrders);
    });

    it('selectProfileOrdersLoading должен возвращать статус загрузки', () => {
      expect(selectProfileOrdersLoading(testState)).toBe(true);
    });

    it('selectProfileOrdersError должен возвращать ошибку', () => {
      const errorState = {
        profileOrders: {
          ...testState.profileOrders,
          error: 'Failed to fetch orders'
        }
      };
      expect(selectProfileOrdersError(errorState)).toBe('Failed to fetch orders');
    });
  });
});
