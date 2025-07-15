import React from 'react';
import './NoRecipesMessage.css';

interface NoRecipesMessageProps {
  showFavorites: boolean;
  hasActiveFilters: boolean;
}

/**
 * Component to display appropriate messages when no recipes are found
 */
const NoRecipesMessage: React.FC<NoRecipesMessageProps> = ({
  showFavorites,
  hasActiveFilters
}) => {
  const containerClass = showFavorites
    ? "no-favorites-message"
    : "no-recipes-message";

  if (showFavorites) {
    if (hasActiveFilters) {
      return (
        <div className={containerClass}>
          <p>None of your favorites match the selected filters.</p>
          <p>Try changing your filter selections.</p>
        </div>
      );
    } else {
      return (
        <div className={containerClass}>
          <p>You haven't saved any favorite recipes yet!</p>
          <p>Click the star icon on recipes you like to save them here.</p>
        </div>
      );
    }
  } else {
    if (hasActiveFilters) {
      return (
        <div className={containerClass}>
          <p>No recipes match your current filters.</p>
          <p>Try adjusting your filter selections.</p>
        </div>
      );
    } else {
      return (
        <div className={containerClass}>
          <p>No recipes found for these ingredients.</p>
          <p>Try searching with different ingredients.</p>
        </div>
      );
    }
  }
};

export default NoRecipesMessage;
