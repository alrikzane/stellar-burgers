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
import { Route, Routes } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';

const App = () => (
  /* public routes*/
  <Routes>
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

    {/* auth routes*/}
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
export default App;
