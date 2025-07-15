import React, { useState, useEffect } from 'react';
import './App.css';
import RecipeList from './components/RecipeList/RecipeList';
import SearchBar from './components/SearchBar/SearchBar';
import AdvancedFilters from './components/AdvancedFilters/AdvancedFilters';
import { Recipe } from './types/Recipe';
import { RecipeService } from './services/RecipeService';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';

// Create an inner App component to use the favorites context
const AppContent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  const { favorites } = useFavorites();

  // Load initial random recipes when app starts
  useEffect(() => {
    const loadInitialRecipes = async () => {
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

  // Apply advanced filters whenever filteredRecipes, cuisineFilter, or dietaryFilters change
  useEffect(() => {
    if (showFavorites) {
      const filteredFavorites = RecipeService.applyAdvancedFilters(
        favorites,
        cuisineFilter,
        dietaryFilters
      );
      setDisplayedRecipes(filteredFavorites);
    } else {
      const filtered = RecipeService.applyAdvancedFilters(
        filteredRecipes,
        cuisineFilter,
        dietaryFilters
      );
      setDisplayedRecipes(filtered);
    }
  }, [filteredRecipes, cuisineFilter, dietaryFilters, favorites, showFavorites]);

  const handleSearch = async (ingredients: string[]) => {
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
      const uniqueRecipes = allRecipes.filter((recipe, index, self) =>
        index === self.findIndex((r) => r.id === recipe.id)
      );

      setFilteredRecipes(uniqueRecipes);
    } catch (err) {
      setError('Failed to search recipes. Please try again later.');
      console.error('Error searching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newCuisineType: string | null, newDietaryPreferences: string[]) => {
    setCuisineFilter(newCuisineType);
    setDietaryFilters(newDietaryPreferences);
  };

  const toggleFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  // Determine page title based on current view and filters
  const getPageTitle = () => {
    if (showFavorites) {
      return "My Favorite Recipes";
    }

    if (cuisineFilter || dietaryFilters.length > 0) {
      const parts = [];
      if (cuisineFilter) parts.push(cuisineFilter);
      if (dietaryFilters.length > 0) parts.push(dietaryFilters.join(", "));
      return `Filtered Recipes (${parts.join(" · ")})`;
    }

    return (filteredRecipes.length === recipes.length) ? "Discover Recipes" : "Matching Recipes";
  };

  const pageTitle = getPageTitle();
  const hasActiveFilters = cuisineFilter !== null || dietaryFilters.length > 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes based on ingredients you have!</p>
      </header>
      <main className="App-main">
        {/* Search bar for ingredient input */}
        <SearchBar onSearch={handleSearch} />

        {/* Advanced filters component */}
        <AdvancedFilters onFilterChange={handleFilterChange} />

        {/* Toggle favorites button */}
        <div className="favorites-toggle-container">
          <button
            className={`favorites-toggle-btn ${showFavorites ? 'active' : ''}`}
            onClick={toggleFavorites}
          >
            {showFavorites ? 'Show All Recipes' : 'Show Favorites'}
          </button>
        </div>

        {/* Loading state */}
        {isLoading && !showFavorites && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading recipes...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && !showFavorites && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {/* Show recipes using the RecipeList component */}
        {(!isLoading || showFavorites) && !error && (
          <RecipeList
            recipes={displayedRecipes}
            title={pageTitle}
          />
        )}

        {/* Show message when no recipes match filters */}
        {!isLoading && !error && displayedRecipes.length === 0 && (
          <div className={showFavorites ? "no-favorites-message" : "no-recipes-message"}>
            {showFavorites ? (
              hasActiveFilters ? (
                <>
                  <p>None of your favorites match the selected filters.</p>
                  <p>Try changing your filter selections.</p>
                </>
              ) : (
                <>
                  <p>You haven't saved any favorite recipes yet!</p>
                  <p>Click the star icon on recipes you like to save them here.</p>
                </>
              )
            ) : (
              hasActiveFilters ? (
                <>
                  <p>No recipes match your current filters.</p>
                  <p>Try adjusting your filter selections.</p>
                </>
              ) : (
                <>
                  <p>No recipes found for these ingredients.</p>
                  <p>Try searching with different ingredients.</p>
                </>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Main App component that provides the context
function App() {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
}

export default App;
