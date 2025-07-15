import React from 'react';
import './RecipeCard.css';

// Define the recipe interface
interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: string[];
  instructions?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-card__image-container">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card__image"
        />
      </div>
      <div className="recipe-card__content">
        <h2 className="recipe-card__title">{recipe.title}</h2>
        <div className="recipe-card__ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        {recipe.instructions && (
          <div className="recipe-card__instructions">
            <h3>Instructions:</h3>
            <p>{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
