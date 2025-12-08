import { Controller, Module, Post } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Difficulty } from './entities/difficulty.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { cuisinesProvider } from './providers/cuisines.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import recipesConfig from './config/recipes.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Difficulty, Event]),
    ConfigModule.forFeature(recipesConfig),//we include the module because we need that in the 
  ],
  controllers: [RecipesController],
  providers: [RecipesService, cuisinesProvider],
})
export class RecipesModule {}
