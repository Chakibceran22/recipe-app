import { Recipe } from "../generated/prisma";
import { RecipeService } from "../services/RecipeService";

import { Request, Response } from "express";
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  async getRecipes(req: Request, res: Response<Recipe[] | { error: string }>) {
    try {
      const recipes = await this.recipeService.getRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching recipes." });
    }
  }

  async getRecipeById(req: Request, res: Response<Recipe | { error: string }>) {
    const { id } = req.params;
    try {
      const recipe = await this.recipeService.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found." });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching the recipe." });
    }
  }

  async createRecipe(
    req: Request<Recipe>,
    res: Response<Recipe | { error: string }>
  ) {
    const recipeData = req.body;
    try {
      const newRecipe = await this.recipeService.createRecipe(recipeData);
      res.status(201).json(newRecipe);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the recipe." });
    }
  }
}
