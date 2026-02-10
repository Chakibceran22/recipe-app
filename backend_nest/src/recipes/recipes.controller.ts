import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Get, Post, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RecomendRecipeDto } from './dto/recomend-recipe/recomend-recipe.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly reciperService: RecipesService) {}


  @ApiOperation({ summary: 'Get all recipes with pagination' })
  @ApiResponse({ status: 200, description: 'List of recipes' , type: [Recipe] })

  @Public()
  @UseGuards(ApiKeyGuard)
  @Get()
  async getRecipes(@Query() paginationQuery: PaginationQueryDto): Promise<Recipe[]> {
    
    return this.reciperService.getAllRecipes(paginationQuery);
  }

  
  @Get(':id')
  async getRecipeById(@Param('id', ParseUUIDPipe) id: string): Promise<Recipe> {
    return this.reciperService.getRecipeById(id);
  }
  
  @Post()
  async createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    return this.reciperService.createRecipe(createRecipeDto);
  }
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createMultipleRecipes(
    @Body() createRecipesDto: CreateRecipeDto[],
  ): Promise<Recipe[]> {
    return this.reciperService.createBulkRecipes(createRecipesDto);
  }

  @Post('recomend')
  @HttpCode(HttpStatus.OK)
  async recomendRecipe(@Body() recipe: RecomendRecipeDto): Promise<void> {
    return this.reciperService.recomendRecipe(recipe);
  }

  @Patch(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() recipeData: UpdateRecipeDto,
  ): Promise<string> {
    return this.reciperService.updateRecipe(id, recipeData);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRecipe(@Param('id') id: string): Promise<string> {
    return this.reciperService.deleteRecipe(id);
  }
}
