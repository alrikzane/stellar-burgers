import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { state } = useLocation();

  if (!state?.ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={state.ingredient} />;
};
