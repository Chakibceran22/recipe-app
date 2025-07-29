export type Recipe  = {
  id: number;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  category: string;
  ingredients: string[];
  instructions: string[];
}

export type RecipeFormData = Omit<Recipe, 'id'>;