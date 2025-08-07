import React, { FC, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { image, price, name, _id } = ingredient;

    const handleIngredientClick = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(`/ingredients/${_id}`, {
        state: {
          background: {
            pathname: location.pathname,
            state: location.state
          },
          ingredient
        },
        replace: true
      });
    };

    return (
      <li className={styles.container} data-ingredient={ingredient.type}>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={{ background: location, ingredient }}
          onClick={handleIngredientClick}
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
