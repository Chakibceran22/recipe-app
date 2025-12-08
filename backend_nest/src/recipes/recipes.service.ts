import { HttpException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { RecomendRecipeDto } from './dto/recomend-recipe/recomend-recipe.dto';
import { CUISINES } from './providers/cuisines.provider';
import recipesConfig from './config/recipes.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    private readonly dataSource: DataSource,
    @Inject(CUISINES) private readonly cuisines: string[], //i will keep this here to showcase how we inject custom providers through the app 
    @Inject(recipesConfig.KEY)//this is how you define a config injection for a specific module or domaine with typeproofing
    private readonly recipeConfig: ConfigType<typeof recipesConfig>
  ) {
    console.log(recipeConfig.coffeeApiKey);
  }
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
    const { limit, offset } = paginationQuery;

    const results = await this.recipeRepository.find({
      skip: offset,
      take: limit,
      order : {
        id : "ASC"//i used this becuse the guy used id inc and for me i dont have them sorted when they come put so basically that wouldnt work when you try to paginate it works only on sorted data 
      }
    });
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
    because of the race condition the recipe might have
    been deleted between readings or whatever but if you
    want to check if there was a conection error or 
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
      console.log(error);
      throw new HttpException('Error inserting bulk recipes', 500);
    } finally {
      await queryRunner.release();
    }
  }

  async recomendRecipe(recipeId: RecomendRecipeDto): Promise<void> {
    const recipe = await this.getRecipeById(recipeId.id);
     //this is basics of transactions with query runners with new versions they changes the connection object to Datasource 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      recipe.recomendations++;
      
      const recomendEvent = new Event();
      recomendEvent.name = 'recommend_recipe';
      recomendEvent.type = 'recipe';
      recomendEvent.payload = { recipeId: recipe.id };

      await queryRunner.manager.save(recipe);
      await queryRunner.manager.save(recomendEvent);
      await queryRunner.commitTransaction();

      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error.message);
      throw new HttpException('Error recommending recipe', 500);

    }
    finally{
      await queryRunner.release();
    }
  }

  private async preloadDifficultyByLevel(level: string): Promise<Difficulty> {
    const existingDifficulty = await this.difficultyRepository.findOne({
      where: { level },
    });
    if (existingDifficulty) {
      return existingDifficulty;
    }
    return this.difficultyRepository.save({ level });
  }
}
