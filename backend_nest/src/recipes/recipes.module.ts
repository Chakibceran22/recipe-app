import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recipe } from "./entities/recipe.entity";
import { Difficulty } from "./entities/difficulty.entity";
import { Event } from "src/events/entities/event.entity/event.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, Difficulty, Event])],
    controllers: [RecipesController],
    providers: [RecipesService],
})
export class RecipesModule {}