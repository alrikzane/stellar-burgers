import { FC } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../store/store';
import { selectUser, selectIsAuthChecked } from '../../store/slices/user-slice';
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

  if (onlyUnAuth) {
    if (!hasToken || (isAuthChecked && !user)) {
      return children || <Outlet />;
    }
    if (hasToken && !isAuthChecked) {
      return <Preloader />;
    }
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (hasToken && !isAuthChecked) {
    return <Preloader />;
  }

  return user ? children || <Outlet /> : <Navigate to='/login' replace />;
};
