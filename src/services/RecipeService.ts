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
  [key: string]: string | null; // For dynamic ingredient/measure properties
}

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

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    ingredients,
    instructions: meal.strInstructions
  };
}
