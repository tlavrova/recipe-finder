import React from 'react';
import './IngredientsList.css';

interface IngredientsListProps {
  ingredients: string[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => (
  <div className="ingredients-container">
    <h3 className="ingredients-title">Ingredients</h3>
    <ul className="ingredients-list">
      {ingredients.map((ingredient, index) => (
        <li key={`ingredient-${index}`} className="ingredient-item">
          {ingredient}
        </li>
      ))}
    </ul>
  </div>
);

export default IngredientsList;
