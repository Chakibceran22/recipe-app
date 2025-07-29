import axios from "axios";
import { Recipe, RecipeFormData } from '../types/Recipe';


export const getRecipes = async ():Promise<Recipe[] | {error: string}> => {
    try {
        const response = await axios.get<Recipe[] | {error: string}>('/api/recipes');
        return response.data;
    } catch (error) {
        return { error:   "An error occurred while fetching recipes." };
    }
}

export const getRecipeById  = async (id: string): Promise<Recipe | {error: string}> => {
    try {
        const response = await axios.get<Recipe | {error: string}>(`/api/recipes/${id}`);
        return response.data;
    } catch (error) {
        return { error: "An error occurred while fetching the recipe." };
    }
}

export const createRecipe =  async (recipeData: RecipeFormData): Promise<Recipe | {error: string}> => {
    try {
        const response = await axios.post<Recipe | {error: string}>('/api/recipes', recipeData);
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