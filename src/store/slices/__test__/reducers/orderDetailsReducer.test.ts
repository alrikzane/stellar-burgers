import orderDetailsReducer, {
  initialState,
  fetchOrderByNumber,
  clearOrderDetails,
  selectOrderDetails,
  selectOrderDetailsLoading,
  selectOrderDetailsError
} from '../../order-details-slice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '100000',
  status: 'done',
  name: 'Заказ 10000 кратонский бургер',
  createdAt: '2025-09-08',
  updatedAt: '2025-09-08',
  number: 10000,
  ingredients: ['ingredient1', 'ingredient2']
};

describe('Тестируем Order-details-slice', () => {
  it('Должен возвращать initial state', () => {
    const state = orderDetailsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Должен обрабатывать clearOrderDetails', () => {
    const stateWithOrder = {
      ...initialState,
      order: mockOrder,
      error: 'Some error'
    };
    const state = orderDetailsReducer(stateWithOrder, clearOrderDetails());
    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });

  it('Должен обрабатывать fetchOrderByNumber.pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderDetailsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Должен обрабатывать fetchOrderByNumber.fulfilled', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = orderDetailsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });

  it('Должен обрабатывать fetchOrderByNumber.rejected', () => {
    const errorMessage = 'Order not found';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderDetailsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  describe('Selectors', () => {
    const testState = {
      orderDetails: {
        order: mockOrder,
        loading: true,
        error: null
      }
    };

    it('selectOrderDetails должен возвращать order', () => {
      expect(selectOrderDetails(testState)).toEqual(mockOrder);
    });

    it('selectOrderDetailsLoading должен возвращать loading статус', () => {
      expect(selectOrderDetailsLoading(testState)).toBe(true);
    });

    it('selectOrderDetailsError должен возвращать ошибку', () => {
      expect(
        selectOrderDetailsError({
          ...testState,
          orderDetails: { ...testState.orderDetails, error: 'Error' }
        })
      ).toBe('Error');
    });
  });
});
