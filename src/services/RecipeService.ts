import { Recipe } from '../types/Recipe';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strArea?: string; // For cuisine type
  strCategory?: string; // Can help with dietary info
  strTags?: string; // Can contain dietary info
  [key: string]: string | null | undefined; // For dynamic ingredient/measure properties
}

// Mapping from TheMealDB areas to our cuisine types
const cuisineMapping: Record<string, string> = {
  'Italian': 'Italian',
  'Mexican': 'Mexican',
  'Chinese': 'Chinese',
  'Indian': 'Indian',
  'Japanese': 'Japanese',
  'Thai': 'Thai',
  'French': 'French',
  'American': 'American',
  // Add more mappings as needed
  'Greek': 'Mediterranean',
  'Lebanese': 'Mediterranean',
  'Moroccan': 'Mediterranean',
  'Turkish': 'Mediterranean',
  // Default is 'Other'
};

// Common ingredients for dietary preferences detection
const dietaryIngredientsMap: Record<string, string[]> = {
  'Vegetarian': ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'lamb', 'bacon', 'prawn', 'shrimp'],
  'Vegan': ['meat', 'milk', 'cheese', 'cream', 'yogurt', 'butter', 'egg', 'honey', 'chicken', 'beef', 'pork', 'fish'],
  'Gluten-Free': ['flour', 'bread', 'pasta', 'wheat', 'rye', 'barley', 'couscous'],
  'Dairy-Free': ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
  // More can be added
};

export const RecipeService = {
  /**
   * Search for recipes by name
   */
  async searchByName(query: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals) return [];

      return data.meals.map(meal => convertMealToRecipe(meal));
    } catch (error) {
      console.error('Error searching recipes by name:', error);
      return [];
    }
  },

  /**
   * Filter recipes by main ingredient
   */
  async filterByIngredient(ingredient: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals) return [];

      // The filter endpoint doesn't return full recipe details
      // We need to fetch each recipe individually
      const recipePromises = data.meals.map(meal =>
        this.getRecipeById(meal.idMeal)
      );

      // Return only the successful recipe fetches
      const recipes = await Promise.all(recipePromises);
      return recipes.filter((recipe): recipe is Recipe => recipe !== null);

    } catch (error) {
      console.error('Error filtering recipes by ingredient:', error);
      return [];
    }
  },

  /**
   * Get a recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals || data.meals.length === 0) return null;

      return convertMealToRecipe(data.meals[0]);
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Get random recipes
   */
  async getRandomRecipes(count: number = 3): Promise<Recipe[]> {
    try {
      // TheMealDB only returns one random meal at a time, so we need multiple calls
      const recipePromises = Array(count).fill(null).map(async () => {
        const response = await fetch(`${API_BASE_URL}/random.php`);
        const data: MealDBResponse = await response.json();

        if (!data.meals || data.meals.length === 0) return null;

        return convertMealToRecipe(data.meals[0]);
      });

      const recipes = await Promise.all(recipePromises);
      return recipes.filter((recipe): recipe is Recipe => recipe !== null);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return [];
    }
  },

  /**
   * Apply advanced filters to recipe list
   */
  applyAdvancedFilters(
    recipes: Recipe[],
    cuisineType: string | null,
    dietaryPreferences: string[]
  ): Recipe[] {
    let filteredRecipes = [...recipes];

    // Apply cuisine filter
    if (cuisineType) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.cuisineType === cuisineType
      );
    }

    // Apply dietary preferences filters
    if (dietaryPreferences.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // Check if recipe matches ALL selected dietary preferences
        return dietaryPreferences.every(pref =>
          recipe.dietaryPreferences?.includes(pref)
        );
      });
    }

    return filteredRecipes;
  },

  /**
   * Get recipes by cuisine type
   */
  async getRecipesByCuisine(cuisineType: string): Promise<Recipe[]> {
    try {
      // TheMealDB uses "area" for cuisine type
      const response = await fetch(`${API_BASE_URL}/filter.php?a=${encodeURIComponent(cuisineType)}`);
      const data: MealDBResponse = await response.json();

      if (!data.meals) return [];

      // Need to fetch details for each recipe
      const recipePromises = data.meals.map(meal => this.getRecipeById(meal.idMeal));
      const recipes = await Promise.all(recipePromises);
      return recipes.filter((recipe): recipe is Recipe => recipe !== null);
    } catch (error) {
      console.error('Error fetching recipes by cuisine:', error);
      return [];
    }
  }
};

/**
 * Convert MealDB meal format to our Recipe format
 */
function convertMealToRecipe(meal: MealDBMeal): Recipe {
  // Extract ingredients and measures
  const ingredients: string[] = [];

  // TheMealDB stores ingredients as strIngredient1, strIngredient2, etc.
  // And measures as strMeasure1, strMeasure2, etc.
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    } else if (ingredient && ingredient.trim() !== '') {
      ingredients.push(ingredient.trim());
    }
  }

  // Determine cuisine type
  let cuisineType = 'Other';
  if (meal.strArea) {
    cuisineType = cuisineMapping[meal.strArea] || 'Other';
  }

  // Determine dietary preferences
  const dietaryPreferences: string[] = [];
  const lowercaseIngredients = ingredients.join(' ').toLowerCase();

  // Check vegetarian
  if (!dietaryIngredientsMap['Vegetarian'].some(item => lowercaseIngredients.includes(item))) {
    dietaryPreferences.push('Vegetarian');

    // Check vegan (must be vegetarian first)
    if (!dietaryIngredientsMap['Vegan'].some(item => lowercaseIngredients.includes(item))) {
      dietaryPreferences.push('Vegan');
    }
  }

  // Check gluten-free
  if (!dietaryIngredientsMap['Gluten-Free'].some(item => lowercaseIngredients.includes(item))) {
    dietaryPreferences.push('Gluten-Free');
  }

  // Check dairy-free
  if (!dietaryIngredientsMap['Dairy-Free'].some(item => lowercaseIngredients.includes(item))) {
    dietaryPreferences.push('Dairy-Free');
  }

  // Use tags for additional dietary info
  if (meal.strTags) {
    const tags = meal.strTags.toLowerCase();
    if (tags.includes('keto')) dietaryPreferences.push('Keto');
    if (tags.includes('paleo')) dietaryPreferences.push('Paleo');
    if (tags.includes('low carb')) dietaryPreferences.push('Low-Carb');
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    ingredients,
    instructions: meal.strInstructions,
    cuisineType,
    dietaryPreferences
  };
}
