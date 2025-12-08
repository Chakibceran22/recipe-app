import { RecipeService } from "../services/RecipeService";
import prisma from "./prisma";

const recipeServiceSingleton = new RecipeService(prisma);
export default recipeServiceSingleton;