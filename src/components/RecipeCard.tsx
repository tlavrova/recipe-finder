import React from 'react';
import './RecipeCard.css';
import { Recipe } from '../types/Recipe';
import RecipeImage from './RecipeImage/RecipeImage';
import IngredientsList from './IngredientsList/IngredientsList';
import Instructions from './Instructions/Instructions';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { title, image, ingredients, instructions } = recipe;

  return (
    <article className="recipe-card">
      <RecipeImage src={image} alt={title} />

      <div className="recipe-card__content">
        <header>
          <h2 className="recipe-card__title">{title}</h2>
        </header>

        <IngredientsList ingredients={ingredients} />

        {instructions && <Instructions instructions={instructions} />}
      </div>
    </article>
  );
};

export default RecipeCard;
