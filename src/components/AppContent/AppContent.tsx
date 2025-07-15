import React, { useState, useEffect, useCallback } from 'react';
import './AppContent.css';
import { Recipe } from '../../types/Recipe';
import { RecipeService } from '../../services/RecipeService';
import { useFavorites } from '../../context/FavoritesContext';
import { FilterState } from '../../types/FilterState';
import Header from './Header/Header';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import ContentDisplay from './ContentDisplay/ContentDisplay';

/**
 * Custom hook to manage recipe state and operations
 */
const useRecipeManagement = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const { favorites } = useFavorites();

  // Load initial recipes
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

  // Search handler
  const handleSearch = useCallback(async (ingredients: string[]): Promise<void> => {
    setShowFavorites(false);

    if (ingredients.length === 0) {
      setFilteredRecipes(recipes);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const recipePromises = ingredients.map(ingredient =>
        RecipeService.filterByIngredient(ingredient)
      );

      const recipeResults = await Promise.all(recipePromises);
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

  // Toggle favorites view
  const toggleFavorites = useCallback((): void => {
    setShowFavorites(prev => !prev);
  }, []);

  return {
    recipes,
    filteredRecipes,
    displayedRecipes,
    setDisplayedRecipes,
    isLoading,
    error,
    showFavorites,
    handleSearch,
    toggleFavorites,
    favorites
  };
};

/**
 * Custom hook to manage filtering operations
 */
const useRecipeFilters = (
  filteredRecipes: Recipe[],
  favorites: Recipe[],
  showFavorites: boolean,
  setDisplayedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>
) => {
  const [filters, setFilters] = useState<FilterState>({
    cuisine: null,
    dietary: []
  });

  // Apply filters whenever source recipes or filter settings change
  useEffect(() => {
    const sourceRecipes = showFavorites ? favorites : filteredRecipes;

    const filtered = RecipeService.applyAdvancedFilters(
      sourceRecipes,
      filters.cuisine,
      filters.dietary
    );

    setDisplayedRecipes(filtered);
  }, [filteredRecipes, filters, favorites, showFavorites, setDisplayedRecipes]);

  // Handle filter changes
  const handleFilterChange = useCallback((newCuisineType: string | null, newDietaryPreferences: string[]): void => {
    setFilters({
      cuisine: newCuisineType,
      dietary: newDietaryPreferences
    });
  }, []);

  const hasActiveFilters = filters.cuisine !== null || filters.dietary.length > 0;

  return {
    filters,
    hasActiveFilters,
    handleFilterChange
  };
};

/**
 * Generate page title based on current state
 */
const usePageTitle = (
  showFavorites: boolean,
  filters: FilterState,
  filteredRecipes: Recipe[],
  recipes: Recipe[]
): string => {
  return useCallback((): string => {
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
  }, [showFavorites, filters, filteredRecipes.length, recipes.length])();
};

/**
 * Main application content component
 */
const AppContent: React.FC = () => {
  const {
    recipes,
    filteredRecipes,
    displayedRecipes,
    setDisplayedRecipes,
    isLoading,
    error,
    showFavorites,
    handleSearch,
    toggleFavorites,
    favorites
  } = useRecipeManagement();

  const {
    filters,
    hasActiveFilters,
    handleFilterChange
  } = useRecipeFilters(filteredRecipes, favorites, showFavorites, setDisplayedRecipes);

  // Derived state
  const pageTitle = usePageTitle(showFavorites, filters, filteredRecipes, recipes);
  const shouldShowRecipes = (!isLoading || showFavorites) && !error;
  const shouldShowNoRecipesMessage = !isLoading && !error && displayedRecipes.length === 0;

  return (
    <div className="app-content">
      <Header />
      <main className="app-main">
        <SearchAndFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          showFavorites={showFavorites}
          onToggleFavorites={toggleFavorites}
        />

        <ContentDisplay
          isLoading={isLoading}
          error={error}
          showFavorites={showFavorites}
          shouldShowRecipes={shouldShowRecipes}
          shouldShowNoRecipesMessage={shouldShowNoRecipesMessage}
          hasActiveFilters={hasActiveFilters}
          recipes={displayedRecipes}
          title={pageTitle}
        />
      </main>
    </div>
  );
};

export default AppContent;
