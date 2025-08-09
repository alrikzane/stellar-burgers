import userReducer, { initialState } from '../../user-slice';

const userMockData = {
  email: 'test@test.ru',
  name: 'Test'
};

const registerMockData = {
  email: 'test@test.ru',
  name: 'Test',
  password: 'test'
};

describe('Тестирвем User-slice редьюсеры', () => {
  it('Должен возвращать initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Тестируем асинхронные экшены', () => {
    // Регистрация
    it('Должен обрабатывать registerUser.fulfilled', () => {
      const action = { 
        type: 'user/register/fulfilled', 
        payload: registerMockData 
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(registerMockData);
      expect(state.isLoading).toBe(false);
    });

    // Вход
    it('Должен обрабатывать loginUser.fulfilled', () => {
      const action = { 
        type: 'user/login/fulfilled', 
        payload: userMockData 
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(userMockData);
    });

    // Выход
    it('Должен обрабатывать logoutUser.fulfilled', () => {
      const stateWithUser = { ...initialState, user: userMockData };
      const state = userReducer(stateWithUser, { 
        type: 'user/logout/fulfilled' 
      });
      expect(state.user).toBeNull();
    });

    // Получение данных
    it('Должен обрабатывать fetchUser.fulfilled', () => {
      const action = { 
        type: 'user/fetchUser/fulfilled', 
        payload: userMockData 
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(userMockData);
    });

    // Обновление данных
    it('Должен обрабатывать updateUser.fulfilled', () => {
      const updatedUser = { ...userMockData, name: 'Test2' };
      const action = { 
        type: 'user/updateUser/fulfilled', 
        payload: updatedUser 
      };
      const state = userReducer(
        { ...initialState, user: userMockData }, 
        action
      );
      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('Тестируем синхронные экшены', () => {
    it('Должен обрабатывать resetError', () => {
      const stateWithError = { 
        ...initialState, 
        error: 'error' 
      };
      const state = userReducer(stateWithError, { 
        type: 'user/resetError' 
      });
      expect(state.error).toBeNull();
    });

    it('Должен обрабатывать checkUserAuth.rejected', () => {
      const state = userReducer(initialState, { 
        type: 'user/checkAuth/rejected' 
      });
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });
});
