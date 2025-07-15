import React from 'react';
import './RecipeCard.css';
import { Recipe } from '../types/Recipe';
import RecipeImage from './RecipeImage/RecipeImage';
import IngredientsList from './IngredientsList/IngredientsList';
import Instructions from './Instructions/Instructions';
import { useFavorites } from '../context/FavoritesContext';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { title, image, ingredients, instructions } = recipe;
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <article className="recipe-card">
      <RecipeImage src={image} alt={title} />

      <button
        className={`favorite-button ${favorite ? 'favorite-button--active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>

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
