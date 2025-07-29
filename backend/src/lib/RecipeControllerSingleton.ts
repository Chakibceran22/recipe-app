import { RecipeController } from "../controllers/RecipeController";

import recipeServiceSingleton from "./ReciperServiceSingleton";

export const recipeControllerSingleton = new RecipeController(recipeServiceSingleton);
