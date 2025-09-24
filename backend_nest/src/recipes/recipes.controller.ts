import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Query } from '@nestjs/common';
import { Get, Post, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
@Controller('recipes')
export class RecipesController {
    constructor(private readonly reciperService: RecipesService) {}
   @Get()
   async getRecipes(): Promise<Recipe[]> {
     return this.reciperService.getAllRecipes();
   }
   @Get(':id')
   async getRecipeById(@Param('id') id: string): Promise<Recipe> {
        return this.reciperService.getRecipeById(id);
   }

   @Post()
   async createRecipe(@Body() createRecipeDto : CreateRecipeDto): Promise<CreateRecipeDto> {
        return this.reciperService.createRecipe(createRecipeDto);
   }

   @Patch(':id')
   async updateRecipe(
    @Param('id') id: string,
    @Body() recipeData: UpdateRecipeDto
   ): Promise<string> {
        return this.reciperService.updateRecipe(id, recipeData);
   }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteRecipe(@Param('id') id: string): Promise<string> {
        return this.reciperService.deleteRecipe(id);
    }
}
