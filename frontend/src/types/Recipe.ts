export type Recipe  = {
  id: number;
  title: string;
  description: string;
  recomendations: number;
  image: string;
  cookTime: number;
  difficulty: Difficulty;
  servings: number;
  category: string;
  ingredients: string[];
  instructions: string[];
}

export type Difficulty = {
  id : string;
  level : string;
}
export type DifficultyDto = {
  level : string;
}

export type RecipeFormData = Omit<Recipe, 'id'|'difficulty'> & { difficulty: DifficultyDto };