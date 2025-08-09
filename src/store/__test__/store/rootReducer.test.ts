import { rootReducer, RootState } from '../../store';

describe('Тестируем инициализацию rootReducer ', () => {
  it('Должен возвращать корректное начальное состояние при UNKNOWN_ACTION', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toMatchObject<RootState>({
      burger: expect.anything(),
      user: expect.anything(),
      feeds: expect.anything(),
      profileOrders: expect.anything(),
      orderDetails: expect.anything()
    });
  });
});
