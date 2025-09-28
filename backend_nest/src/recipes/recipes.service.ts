import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    private readonly dataSource: DataSource,
  ) {}
  async getRecipeById(id: string): Promise<Recipe> {
    const result = await this.recipeRepository.findOne({
      where: { id },
      relations: ['difficulty'],
    });
    if (!result) {
      throw new NotFoundException('Recipe not found');
    }
    return result;
  }

  async getAllRecipes(paginationQuery: PaginationQueryDto): Promise<Recipe[]> {
    const { limit = 10, offset = 0 } = paginationQuery;
    
    // Debug logging
    console.log('=== PAGINATION DEBUG ===');
    console.log('Offset:', offset, typeof offset);
    console.log('Limit:', limit, typeof limit);
    
    const results = await this.recipeRepository.find({
      skip: offset,
      take: limit,
      order: {
        id: 'DESC'  // CRITICAL: Add consistent ordering
      }
    });
    
    console.log('Total results returned:', results.length);
    console.log('First result ID:', results[0]?.id);
    console.log('========================');
    
    return results;
}

  async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
    const difficulty = await this.preloadDifficultyByLevel(data.difficulty);
    const recipe = this.recipeRepository.create({
      ...data,
      difficulty,
    }); // this is interesting  you create first the Recipe Entity object with all the new fields and then you save it
    const result = await this.recipeRepository.save(recipe);
    if (!result) {
      throw new HttpException('Error creating recipe', 500);
    }
    return result;
  }

  async updateRecipe(id: string, data: UpdateRecipeDto): Promise<string> {
    const difficulty =
      data.difficulty && (await this.preloadDifficultyByLevel(data.difficulty)); // we do this prealod to verify of the diff exists beforehand if not we create new one
    const recipe = await this.recipeRepository.preload({
      id: id,
      ...data,
      difficulty: difficulty || undefined,
    }); //we preload to not have issues with exitance you see this is the safer way
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    const result = await this.recipeRepository.save(recipe);
    if (!result) {
      throw new HttpException('Error updating recipe', 500);
    }
    return 'Recipe updated successfully';
  }

  async deleteRecipe(id: string): Promise<string> {
    const recipe = await this.getRecipeById(id);

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

  async createBulkRecipes(recipes: CreateRecipeDto[]): Promise<Recipe[]> {
    if (recipes.length === 0) {
      throw new HttpException('No recipes to insert', 400);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdRecipes: Recipe[] = [];
      const difficultyLevels = [
        ...new Set(recipes.map((recipe) => recipe.difficulty)),
      ];
      const difficulties = await Promise.all(
        difficultyLevels.map((level) => this.preloadDifficultyByLevel(level)),
      );

      const difficultyMap = new Map<string, Difficulty>();
      difficulties.forEach((diff) => difficultyMap.set(diff.level, diff));

      for (const recipeData of recipes) {
        const difficulty = difficultyMap.get(recipeData.difficulty);
        if (!difficulty) {
          throw new HttpException(
            `Difficulty ${recipeData.difficulty} not found`,
            400,
          );
        }

        const recipe = queryRunner.manager.create(Recipe, {
          ...recipeData,
          difficulty,
        });

        const savedRecipe = await queryRunner.manager.save(recipe);
        createdRecipes.push(savedRecipe);
      }

      await queryRunner.commitTransaction();
      return createdRecipes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('Error inserting bulk recipes', 500);
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadDifficultyByLevel(level: string): Promise<Difficulty> {
    const existingFlavor = await this.difficultyRepository.findOne({
      where: { level },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.difficultyRepository.create({ level });
  }
}
