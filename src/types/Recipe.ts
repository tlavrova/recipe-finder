export interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: string[];
  instructions?: string;
  cuisineType?: string;
  dietaryPreferences?: string[];
}

export type CuisineType =
  | 'Italian'
  | 'Mexican'
  | 'Chinese'
  | 'Indian'
  | 'Japanese'
  | 'Thai'
  | 'Mediterranean'
  | 'American'
  | 'French'
  | 'Other';

export type DietaryPreference =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'Low-Carb'
  | 'Keto'
  | 'Paleo'
  | 'Nut-Free';
