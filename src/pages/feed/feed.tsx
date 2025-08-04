import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { fetchFeeds } from '../../store/slices/feeds-slice';
import { useDispatch, useSelector } from '../../store/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return isLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={data.orders} handleGetFeeds={handleGetFeeds} />
  );
};
