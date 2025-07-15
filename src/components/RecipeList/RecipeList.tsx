import React from 'react';
import './RecipeList.css';
import RecipeCard from '../RecipeCard';
import { Recipe } from '../../types/Recipe';

interface RecipeListProps {
  recipes: Recipe[];
  title?: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, title }) => {
  return (
    <section className="recipe-list-container">
      {title && <h2 className="recipe-list-title">{title}</h2>}

      {recipes.length === 0 ? (
        <div className="recipe-list-empty">
          <p>No recipes found. Try different ingredients!</p>
        </div>
      ) : (
        <div className="recipe-list-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipeList;
