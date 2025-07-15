import React, { useState, useEffect } from 'react';
import './App.css';
import RecipeList from './components/RecipeList/RecipeList';
import SearchBar from './components/SearchBar/SearchBar';
import { Recipe } from './types/Recipe';
import { RecipeService } from './services/RecipeService';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';

// Create an inner App component to use the favorites context
const AppContent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

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
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error('Error loading initial recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialRecipes();
  }, []);

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

  const toggleFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  // Determine which recipes to display
  const displayedRecipes = showFavorites ? favorites : filteredRecipes;
  const pageTitle = showFavorites ? "My Favorite Recipes" :
                   (filteredRecipes.length === recipes.length ? "Discover Recipes" : "Matching Recipes");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes based on ingredients you have!</p>
      </header>
      <main className="App-main">
        {/* Search bar for ingredient input */}
        <SearchBar onSearch={handleSearch} />

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

        {/* Show message when no favorites */}
        {showFavorites && favorites.length === 0 && (
          <div className="no-favorites-message">
            <p>You haven't saved any favorite recipes yet!</p>
            <p>Click the star icon on recipes you like to save them here.</p>
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
