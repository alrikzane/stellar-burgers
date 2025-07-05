import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../store/store';
import {
  selectConstructorState,
  selectOrderState,
  createOrder
} from '../../store/slices/burger-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(selectConstructorState);
  const { status: orderStatus, data: orderData } =
    useSelector(selectOrderState);

  const onOrderClick = () => {
    if (!bun || orderStatus === 'loading') return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {};

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
