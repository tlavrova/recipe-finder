import React from 'react';
import './IngredientTag.css';

interface IngredientTagProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
}

/**
 * Component that displays a single ingredient tag with a remove button
 */
const IngredientTag: React.FC<IngredientTagProps> = ({ ingredient, onRemove }) => (
  <div className="ingredient-tag">
    <span>{ingredient}</span>
    <button
      type="button"
      className="remove-ingredient"
      onClick={() => onRemove(ingredient)}
      aria-label={`Remove ${ingredient}`}
    >
      ×
    </button>
  </div>
);

export default IngredientTag;
