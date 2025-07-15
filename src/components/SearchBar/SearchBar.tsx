import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (ingredients: string[]) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Enter ingredients (comma separated)'
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addIngredient = () => {
    if (inputValue.trim()) {
      // Check if user entered multiple ingredients separated by commas
      const newIngredients = inputValue
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '' && !ingredients.includes(item));

      if (newIngredients.length > 0) {
        const updatedIngredients = [...ingredients, ...newIngredients];
        setIngredients(updatedIngredients);
        setInputValue('');
      }
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add current input if there's any before searching
    if (inputValue.trim()) {
      addIngredient();
      // We need to manually trigger the search since state won't update immediately
      const newIngredients = inputValue
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '' && !ingredients.includes(item));

      onSearch([...ingredients, ...newIngredients]);
    } else {
      onSearch(ingredients);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addIngredient();
    } else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      // Remove the last ingredient when backspace is pressed on empty input
      const updatedIngredients = [...ingredients];
      updatedIngredients.pop();
      setIngredients(updatedIngredients);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <div className="ingredient-tags">
            {ingredients.map((ingredient, index) => (
              <div key={`${ingredient}-${index}`} className="ingredient-tag">
                <span>{ingredient}</span>
                <button
                  type="button"
                  className="remove-ingredient"
                  onClick={() => removeIngredient(ingredient)}
                  aria-label={`Remove ${ingredient}`}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="ingredient-input"
              placeholder={ingredients.length === 0 ? placeholder : ''}
              aria-label="Enter ingredient"
            />
          </div>
          <button type="button" onClick={addIngredient} className="add-ingredient-btn">
            Add
          </button>
        </div>
        <button type="submit" className="search-btn">
          Find Recipes
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
