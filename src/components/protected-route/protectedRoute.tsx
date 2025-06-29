import { FC } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthChecked } from '../../services/slices/user';
import { getCookie } from '../../utils/cookie';

export type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const hasToken = Boolean(getCookie('accessToken'));
  console.log('[ProtectedRoute]', { user, isAuthChecked, onlyUnAuth });

  if (onlyUnAuth) {
    if (isAuthChecked && user) {
      const from = location.state?.from || { pathname: '/' };
      return <Navigate to={from} replace />;
    }
    return children || <Outlet />;
  }

  if (hasToken && !isAuthChecked) {
    return <Preloader />;
  }

  return user ? (
    children || <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
