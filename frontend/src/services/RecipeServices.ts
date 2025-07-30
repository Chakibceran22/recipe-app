import axios from "axios";
import { Recipe, RecipeFormData } from '../types/Recipe';
import { AwardIcon } from "lucide-react";


export const getRecipesRaw = async ():Promise<Recipe[]| {error: string} > => {
    try {
        const response = await axios.get<Recipe[] | {error: string}>('http://localhost:3000/api/recipes');
        return response.data;
    } catch (error) {
        throw new Error("An error occurred while fetching recipes.");
    }
}
export const getRecipes = async (): Promise<Recipe[]> => {
    const result = await getRecipesRaw();
    
    // Check if result has error property
    if ('error' in result) {
        throw new Error(result.error);
    }
    
    return result; // This will be Recipe[]
}

export const getRecipeById  = async (id: string): Promise<Recipe | {error: string}> => {
    try {
        const response = await axios.get<Recipe | {error: string}>(`http://localhost:3000/api/recipes/${id}`);
        return response.data;
    } catch (error) {
        return { error: "An error occurred while fetching the recipe." };
    }
}

export const createRecipeRaw =  async (recipeData: RecipeFormData): Promise<Recipe | {error: string}> => {
    try {
        const response = await axios.post<Recipe | {error: string}>('http://localhost:3000/api/create-recipe', recipeData);
        if(response){
            return response.data;
        }
        else{
            return { error: "Failed to create recipe."}
        }
    } catch (error) {
        return { error: "An error occurred while creating the recipe." };
    }
}

export const createRecipe = async (recipeData: RecipeFormData): Promise<Recipe> => {
    try {
        const recipe = await createRecipeRaw(recipeData);
        if ('error' in recipe) {
            throw new Error(recipe.error);
        }
        return recipe; // This will be Recipe
    } catch (error) {
        throw new Error("An error accured in fetching the data")
    }
}