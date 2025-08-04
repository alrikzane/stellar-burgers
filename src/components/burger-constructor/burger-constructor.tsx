import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../store/store';
import {
  selectConstructorState,
  selectOrderState,
  createOrder,
  resetOrder
} from '../../store/slices/burger-slice';
import { selectUser } from '../../store/slices/user-slice';
import { clearConstructor } from '../../store/slices/burger-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const { bun, ingredients } = useSelector(selectConstructorState);
  const { status: orderStatus, data: orderData } =
    useSelector(selectOrderState);

  useEffect(() => {
    if (orderStatus === 'succeeded') {
      dispatch(clearConstructor());
    }
  }, [orderStatus, dispatch]);

  const onOrderClick = () => {
    if (!bun || orderStatus === 'loading') return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderStatus === 'loading'}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
