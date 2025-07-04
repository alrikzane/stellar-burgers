import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { useDispatch } from '../../store/store';
import { checkUserAuth } from '../../store/slices/user-slice';
import { getCookie, deleteCookie } from '../../utils/cookie';

const App = () => {
  const dispatch = useDispatch();
  /* TODO modals  const location = useLocation();
  const backgroundLocation = location.state?.background; */
  const token = getCookie('accessToken');

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(checkUserAuth())
        .unwrap()
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    }
  }, [dispatch, token]);
  return (
    <Routes>
      {/* public */}
      <Route
        path='*'
        element={
          <div className={styles.app}>
            <AppHeader />
            <NotFound404 />
          </div>
        }
      />

      <Route
        path='/'
        element={
          <div className={styles.app}>
            <AppHeader />
            <ConstructorPage />
          </div>
        }
      />

      <Route
        path='/feed'
        element={
          <div className={styles.app}>
            <AppHeader />
            <Feed />
          </div>
        }
      />

      {/* unauthorized */}
      <Route element={<ProtectedRoute onlyUnAuth />}>
        <Route
          path='/login'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Login />
            </div>
          }
        />
        <Route
          path='/register'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Register />
            </div>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ForgotPassword />
            </div>
          }
        />
        <Route
          path='/reset-password'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ResetPassword />
            </div>
          }
        />
      </Route>
      {/* authorized */}
      <Route element={<ProtectedRoute />}>
        <Route
          path='/profile'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Profile />
            </div>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ProfileOrders />
            </div>
          }
        />
      </Route>

      {/* modals */}
      <Route
        path='/feed/:number'
        element={
          <div className={styles.app}>
            <AppHeader />
            <OrderInfo />
          </div>
        }
      />

      <Route
        path='/ingredients/:id'
        element={
          <div className={styles.app}>
            <AppHeader />
            <IngredientDetails />
          </div>
        }
      />

      <Route
        path='/profile/orders/:number'
        element={
          <div className={styles.app}>
            <AppHeader />
            <OrderInfo />
          </div>
        }
      />
    </Routes>
  );
};
export default App;
