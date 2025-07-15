import React, { useState, useEffect, useCallback } from 'react';
import './AppContent.css';
import RecipeList from '../RecipeList/RecipeList';
import SearchBar from '../SearchBar/SearchBar';
import AdvancedFilters from '../AdvancedFilters/AdvancedFilters';
import { Recipe } from '../../types/Recipe';
import { RecipeService } from '../../services/RecipeService';
import { useFavorites } from '../../context/FavoritesContext';
import { FilterState } from '../../types/FilterState';
import NoRecipesMessage from '../Messages/NoRecipesMessage';
import LoadingIndicator from '../Messages/LoadingIndicator';
import ErrorDisplay from '../Messages/ErrorDisplay';

/**
 * Main application content component
 */
const AppContent: React.FC = () => {
  // Recipe state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    cuisine: null,
    dietary: []
  });

  const { favorites } = useFavorites();

  /**
   * Load initial random recipes when app starts
   */
  useEffect(() => {
    const loadInitialRecipes = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const randomRecipes = await RecipeService.getRandomRecipes(6);
        setRecipes(randomRecipes);
        setFilteredRecipes(randomRecipes);
        setDisplayedRecipes(randomRecipes);
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error('Error loading initial recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialRecipes();
  }, []);

  /**
   * Apply advanced filters whenever source recipes or filter settings change
   */
  useEffect(() => {
    const sourceRecipes = showFavorites ? favorites : filteredRecipes;

    const filtered = RecipeService.applyAdvancedFilters(
      sourceRecipes,
      filters.cuisine,
      filters.dietary
    );

    setDisplayedRecipes(filtered);
  }, [filteredRecipes, filters, favorites, showFavorites]);

  /**
   * Handle ingredient search
   */
  const handleSearch = useCallback(async (ingredients: string[]): Promise<void> => {
    setShowFavorites(false);

    if (ingredients.length === 0) {
      setFilteredRecipes(recipes);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TheMealDB API can only search for one ingredient at a time
      // So we'll fetch recipes for each ingredient and combine them
      const recipePromises = ingredients.map(ingredient =>
        RecipeService.filterByIngredient(ingredient)
      );

      const recipeResults = await Promise.all(recipePromises);

      // Flatten and remove duplicates
      const allRecipes = recipeResults.flat();
      const uniqueRecipes = allRecipes.filter(
        (recipe, index, self) => index === self.findIndex(r => r.id === recipe.id)
      );

      setFilteredRecipes(uniqueRecipes);
    } catch (err) {
      setError('Failed to search recipes. Please try again later.');
      console.error('Error searching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [recipes]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((newCuisineType: string | null, newDietaryPreferences: string[]): void => {
    setFilters({
      cuisine: newCuisineType,
      dietary: newDietaryPreferences
    });
  }, []);

  /**
   * Toggle favorites view
   */
  const toggleFavorites = useCallback((): void => {
    setShowFavorites(prev => !prev);
  }, []);

  /**
   * Determine page title based on current view and filters
   */
  const getPageTitle = useCallback((): string => {
    if (showFavorites) {
      return "My Favorite Recipes";
    }

    if (filters.cuisine || filters.dietary.length > 0) {
      const parts = [];
      if (filters.cuisine) parts.push(filters.cuisine);
      if (filters.dietary.length > 0) parts.push(filters.dietary.join(", "));
      return `Filtered Recipes (${parts.join(" · ")})`;
    }

    return (filteredRecipes.length === recipes.length)
      ? "Discover Recipes"
      : "Matching Recipes";
  }, [showFavorites, filters, filteredRecipes.length, recipes.length]);

  const pageTitle = getPageTitle();
  const hasActiveFilters = filters.cuisine !== null || filters.dietary.length > 0;
  const shouldShowRecipes = (!isLoading || showFavorites) && !error;
  const shouldShowNoRecipesMessage = !isLoading && !error && displayedRecipes.length === 0;

  return (
    <div className="app-content">
      <header className="app-header">
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes based on ingredients you have!</p>
      </header>
      <main className="app-main">
        {/* Search and Filter UI */}
        <SearchBar onSearch={handleSearch} />
        <AdvancedFilters onFilterChange={handleFilterChange} />

        <div className="favorites-toggle-container">
          <button
            className={`favorites-toggle-btn ${showFavorites ? 'active' : ''}`}
            onClick={toggleFavorites}
          >
            {showFavorites ? 'Show All Recipes' : 'Show Favorites'}
          </button>
        </div>

        {/* Content States */}
        {isLoading && !showFavorites && <LoadingIndicator />}
        {error && !isLoading && !showFavorites && <ErrorDisplay message={error} />}
        {shouldShowRecipes && <RecipeList recipes={displayedRecipes} title={pageTitle} />}
        {shouldShowNoRecipesMessage && (
          <NoRecipesMessage
            showFavorites={showFavorites}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </main>
    </div>
  );
};

export default AppContent;
