import React from 'react';
import './ContentDisplay.css';
import { Recipe } from '../../../types/Recipe';
import RecipeList from '../../RecipeList/RecipeList';
import NoRecipesMessage from '../../Messages/NoRecipesMessage';
import LoadingIndicator from '../../Messages/LoadingIndicator';
import ErrorDisplay from '../../Messages/ErrorDisplay';

interface ContentDisplayProps {
  isLoading: boolean;
  error: string | null;
  showFavorites: boolean;
  shouldShowRecipes: boolean;
  shouldShowNoRecipesMessage: boolean;
  hasActiveFilters: boolean;
  recipes: Recipe[];
  title: string;
}

/**
 * Content display component based on current state
 */
const ContentDisplay: React.FC<ContentDisplayProps> = ({
  isLoading,
  error,
  showFavorites,
  shouldShowRecipes,
  shouldShowNoRecipesMessage,
  hasActiveFilters,
  recipes,
  title
}) => (
  <div className="content-display">
    {isLoading && !showFavorites && <LoadingIndicator />}
    {error && !isLoading && !showFavorites && <ErrorDisplay message={error} />}
    {shouldShowRecipes && <RecipeList recipes={recipes} title={title} />}
    {shouldShowNoRecipesMessage && (
      <NoRecipesMessage
        showFavorites={showFavorites}
        hasActiveFilters={hasActiveFilters}
      />
    )}
  </div>
);

export default ContentDisplay;
