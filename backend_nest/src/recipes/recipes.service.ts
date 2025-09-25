import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}
  async getRecipeById(id: string): Promise<Recipe> {
    const result = await this.recipeRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Recipe not found');
    }
    return result;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const results = await this.recipeRepository.find();
    return results;
  }

  async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipeRepository.create(data); // this is interesting  you create first the Recipe Entity object with all the new fields and then you save it
    const result = await this.recipeRepository.save(recipe);
    if (!result) {
      throw new HttpException('Error creating recipe', 500);
    }
    return result;
  }

  async updateRecipe(id: string, data: UpdateRecipeDto): Promise<string> {
    const result = await this.recipeRepository.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('Recipe not found');
    }
    return 'Recipe updated successfully';
  }

  async deleteRecipe(id: string): Promise<string> {
    const recipe = await this.getRecipeById(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    try {
      const removed = await this.recipeRepository.remove(recipe);
      /*
    the try catch wrappings being handled like this 
    because of the race condition the recipe mght have
    been deleted between readings or whatever but if you
    want to check if there wasa conection error or 
    a timeout or whatever db error you had this would be 
    the best case to handle it remember this  
    */
      if (!removed) {
        throw new NotFoundException('Recipe not found');
      }

      return 'Recipe deleted successfully';
    } catch (error) {
      throw new HttpException('Error deleting recipe', 500);
    }
  }
}
