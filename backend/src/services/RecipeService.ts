import { Recipe } from "../generated/prisma";
import { PrismaClient } from "../generated/prisma";
export class RecipeService {
    constructor(private prisma: PrismaClient) {}
    async getRecipes() : Promise<Recipe[]> {
        const recipes = await this.prisma.recipe.findMany();
        return recipes;
    }

    async getRecipeById(id: string): Promise<Recipe | null> {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id }
        })
        return recipe;
    }

    async createRecipe(data: Omit<Recipe, 'id'>): Promise<Recipe>{
        const newRecipe = await this.prisma.recipe.create({
            data
        })
        return newRecipe;
    }
}