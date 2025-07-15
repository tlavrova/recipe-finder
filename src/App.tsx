import React from 'react';
import './App.css';
import RecipeCard from './components/RecipeCard';

function App() {
  // Example recipe data
  const sampleRecipe = {
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
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes based on ingredients you have!</p>
      </header>
      <main className="App-main">
        <RecipeCard recipe={sampleRecipe} />
      </main>
    </div>
  );
}

export default App;
