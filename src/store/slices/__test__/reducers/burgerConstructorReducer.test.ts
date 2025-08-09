import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState,
  fetchIngredients,
  createOrder,
  setCurrentIngredient,
  clearCurrentIngredient,
  resetOrder
} from '../../burger-slice';
import type { TIngredient } from '../../../../utils/types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
};

describe('Тестирование burgerSlice reducer', () => {
  describe('Тестирование начального состояния', () => {
    it('Должен вернуть начальное состояние', () => {
      const state = burgerReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Тестирование добавление ингредиентов', () => {
    it('Должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = burgerReducer(initialState, action);

      expect(state.constructor.bun).toMatchObject({
        ...mockBun,
        id: expect.any(String)
      });
      expect(state.constructor.ingredients).toHaveLength(0);
    });

    it('Должен добавить ингредиент в конструктор', () => {
      const action = addIngredient(mockMain);
      const state = burgerReducer(initialState, action);

      expect(state.constructor.ingredients).toEqual([
        expect.objectContaining({
          ...mockMain,
          id: expect.any(String)
        })
      ]);
    });

    it('Должен добавить соус в конструктор', () => {
      const action = addIngredient(mockSauce);
      const state = burgerReducer(initialState, action);

      expect(state.constructor.ingredients[0].type).toBe('sauce');
    });
  });

  describe('Тестируем удаление ингредиента', () => {
    it('Должен удалить ингредиент с выбранным id', () => {
      let state = burgerReducer(initialState, addIngredient(mockMain));
      state = burgerReducer(state, addIngredient(mockSauce));

      const idToRemove = state.constructor.ingredients[0].id;
      state = burgerReducer(state, removeIngredient(idToRemove));

      expect(state.constructor.ingredients).toHaveLength(1);
      expect(state.constructor.ingredients[0].type).toBe('sauce');
    });
  });

  describe('Теструем перемещение ингредиента', () => {
    it('Должен сдвинуть ингредиент вниз', () => {
      let state = burgerReducer(initialState, addIngredient(mockMain));
      state = burgerReducer(state, addIngredient(mockSauce));

      const initialOrder = state.constructor.ingredients.map((i) => i.type);
      state = burgerReducer(state, moveIngredient(0, 1));

      const updatedOrder = state.constructor.ingredients.map((i) => i.type);
      expect(updatedOrder).not.toEqual(initialOrder);
      expect(updatedOrder).toEqual(['sauce', 'main']);
    });
  });

  describe('Тестируем очистку конструктора', () => {
    it('Должен вернуть конструктор в изначальное положение', () => {
      let state = burgerReducer(initialState, addIngredient(mockBun));
      state = burgerReducer(state, addIngredient(mockMain));
      state = burgerReducer(state, clearConstructor());

      expect(state.constructor).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });
});

describe('Тестирование асинхронных экшенов', () => {
  describe('fetchIngredients', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = burgerReducer(initialState, action);

      expect(state.ingredients.loading).toBe(true);
      expect(state.ingredients.error).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const ingredients = [mockBun, mockMain, mockSauce];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      };
      const state = burgerReducer(initialState, action);

      expect(state.ingredients.loading).toBe(false);
      expect(state.ingredients.data).toEqual(ingredients);
      expect(state.ingredients.lastFetched).not.toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Failed to fetch';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = burgerReducer(initialState, action);

      expect(state.ingredients.loading).toBe(false);
      expect(state.ingredients.error).toBe(errorMessage);
    });
  });

  describe('тестирование createOrder', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: createOrder.pending.type };
      const state = burgerReducer(initialState, action);

      expect(state.order.status).toBe('loading');
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const mockOrder = { number: 12345 };
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = burgerReducer(initialState, action);

      expect(state.order.status).toBe('succeeded');
      expect(state.order.data).toEqual(mockOrder);
    });

    it('должен обрабатывать rejected состояние', () => {
      const action = { type: createOrder.rejected.type };
      const state = burgerReducer(initialState, action);

      expect(state.order.status).toBe('failed');
    });
  });
});

describe('Тестирование setCurrentIngredient, clearCurrentIngredient и resetOrder', () => {
  it('должен устанавливать текущий ингредиент', () => {
    const action = setCurrentIngredient(mockMain);
    const state = burgerReducer(initialState, action);

    expect(state.currentIngredient).toEqual(mockMain);
  });

  it('должен очищать текущий ингредиент', () => {
    let state = burgerReducer(initialState, setCurrentIngredient(mockMain));
    state = burgerReducer(state, clearCurrentIngredient());

    expect(state.currentIngredient).toBeNull();
  });

  it('должен сбрасывать заказ', () => {
    const mockOrder = { number: 12345 };
    let state = burgerReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });
    state = burgerReducer(state, resetOrder());

    expect(state.order).toEqual(initialState.order);
  });
});
