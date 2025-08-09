
import feedsReducer, { initialState, fetchFeeds } from '../../feeds-slice';
import { TOrdersData } from '@utils-types';

const mockOrdersData: TOrdersData = {
  orders: [
    {
      _id: '100000',
      status: 'done',
      name: 'Заказ 10000 кратонский бургер',
      createdAt: '2025-09-08',
      updatedAt: '2025-09-08',
      number: 10000,
      ingredients: ['ingredient1', 'ingredient2']
    }
  ],
  total: 100,
  totalToday: 10
};

describe('Тестируем Feeds-slice', () => {
  it('Должен возвращать начальное состояние', () => {
    const state = feedsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Должен обрабатывать fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Должен обрабатывать fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockOrdersData
    };
    const state = feedsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.data).toEqual(mockOrdersData);
  });

  it('Должен обрабатывать fetchFeeds.rejected', () => {
    const errorMessage = 'Failed to fetch feeds';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.data).toEqual(initialState.data);
  });
});
