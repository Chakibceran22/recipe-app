import express from 'express';
import { Request,Response } from 'express';
import { recipeControllerSingleton } from '../lib/RecipeControllerSingleton';
import { Recipe } from '../generated/prisma';
const router  = express.Router();

router.get('/recipes', (req: Request, res: Response) => {
    recipeControllerSingleton.getRecipes(req, res);
})

router.get('/recipes/:id', (req: Request, res: Response) => {
    recipeControllerSingleton.getRecipeById(req, res);
})

router.post('/create-recipe', (req: Request<{},{},Omit<Recipe,'id'>>, res: Response) => {
    recipeControllerSingleton.createRecipe(req, res);
})

export default router;
