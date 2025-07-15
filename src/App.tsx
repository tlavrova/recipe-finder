import React, { useState } from 'react';
import './App.css';
import RecipeCard from './components/RecipeCard';
import RecipeList from './components/RecipeList/RecipeList';
import SearchBar from './components/SearchBar/SearchBar';
import { Recipe } from './types/Recipe';

function App() {
  // Sample recipes data
  const sampleRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      image: 'https://images.unsplash.com/photo-1608219994488-388d23a0c1c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ingredients: [
        '200g spaghetti pasta',
        '100g pancetta or bacon, diced',
        '2 large eggs',
        '50g Pecorino Romano cheese, grated',
        '50g Parmesan cheese, grated',
        '2 cloves garlic, minced',
        'Salt and black pepper to taste'
      ],
      instructions: 'Cook pasta until al dente. Meanwhile, fry the pancetta until crispy. Beat eggs with grated cheese. Drain pasta, combine with pancetta, then quickly mix in egg mixture off heat. Season and serve immediately.'
    },
    {
      id: '2',
      title: 'Caprese Salad',
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ingredients: [
        '3 large tomatoes, sliced',
        '250g fresh mozzarella cheese, sliced',
        'Fresh basil leaves',
        '2 tbsp extra virgin olive oil',
        '1 tbsp balsamic glaze',
        'Salt and pepper to taste'
      ],
      instructions: 'Arrange alternating slices of tomatoes and mozzarella on a plate. Tuck basil leaves between slices. Drizzle with olive oil and balsamic glaze. Season with salt and pepper.'
    },
    {
      id: '3',
      title: 'Chicken Stir Fry',
      image: 'https://images.unsplash.com/photo-1603356033288-acfcb54801e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ingredients: [
        '500g chicken breast, sliced',
        '1 bell pepper, sliced',
        '1 onion, sliced',
        '2 carrots, julienned',
        '2 tbsp soy sauce',
        '1 tbsp oyster sauce',
        '2 cloves garlic, minced',
        '1 tbsp vegetable oil'
      ],
      instructions: 'Heat oil in a wok over high heat. Add garlic and stir for 30 seconds. Add chicken and cook until no longer pink. Add vegetables and stir fry for 3-4 minutes. Add sauces and stir to combine. Serve hot over rice.'
    }
  ];

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(sampleRecipes);

  const handleSearch = (ingredients: string[]) => {
    if (ingredients.length === 0) {
      // If no ingredients specified, show all recipes
      setFilteredRecipes(sampleRecipes);
      return;
    }

    // Filter recipes that contain at least one of the specified ingredients
    const filtered = sampleRecipes.filter(recipe => {
      return ingredients.some(ingredient =>
        recipe.ingredients.some(recipeIngredient =>
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    });

    setFilteredRecipes(filtered);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes based on ingredients you have!</p>
      </header>
      <main className="App-main">
        {/* Search bar for ingredient input */}
        <SearchBar onSearch={handleSearch} />

        {/* Show all recipes using the RecipeList component */}
        <RecipeList
          recipes={filteredRecipes}
          title={filteredRecipes.length === sampleRecipes.length ? "All Recipes" : "Matching Recipes"}
        />
      </main>
    </div>
  );
}

export default App;
