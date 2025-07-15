import React, { useState } from 'react';
import './SearchBar.css';
import IngredientTag from './IngredientTag';

interface SearchBarProps {
  onSearch: (ingredients: string[]) => void;
  placeholder?: string;
}

/**
 * SearchBar component that allows users to input ingredients and search for recipes
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Enter ingredients (comma separated)'
}) => {
  // State for managing input and ingredients
  const [inputValue, setInputValue] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  /**
   * Parses input text into a list of valid ingredients
   */
  const parseIngredients = (text: string): string[] => {
    return text
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '' && !ingredients.includes(item));
  };

  /**
   * Handles changes to the input field
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * Adds new ingredients from the current input value
   */
  const addIngredient = () => {
    if (!inputValue.trim()) return;

    const newIngredients = parseIngredients(inputValue);

    if (newIngredients.length > 0) {
      setIngredients(prevIngredients => [...prevIngredients, ...newIngredients]);
      setInputValue('');
    }
  };

  /**
   * Removes a specific ingredient from the list
   */
  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient !== ingredientToRemove)
    );
  };

  /**
   * Handles form submission to search for recipes
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add current input if there's any before searching
    if (inputValue.trim()) {
      // We need to manually parse ingredients since addIngredient won't update state immediately
      const newIngredients = parseIngredients(inputValue);
      onSearch([...ingredients, ...newIngredients]);

      // Then update our local state
      if (newIngredients.length > 0) {
        setIngredients(prevIngredients => [...prevIngredients, ...newIngredients]);
        setInputValue('');
      }
    } else {
      onSearch(ingredients);
    }
  };

  /**
   * Handles keyboard events for the input field
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add ingredient on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addIngredient();
    }
    // Remove last ingredient on Backspace if input is empty
    else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      setIngredients(prevIngredients => prevIngredients.slice(0, -1));
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <div className="ingredient-tags">
            {/* Display ingredient tags */}
            {ingredients.map((ingredient, index) => (
              <IngredientTag
                key={`${ingredient}-${index}`}
                ingredient={ingredient}
                onRemove={removeIngredient}
              />
            ))}

            {/* Input field for new ingredients */}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="search-input"
              placeholder={ingredients.length === 0 ? placeholder : ''}
              aria-label="Enter ingredient"
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={addIngredient}
            className="search-button"
            aria-label="Add ingredient"
          >
            Add
          </button>
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="search-button"
          aria-label="Search for recipes"
        >
          Find Recipes
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
