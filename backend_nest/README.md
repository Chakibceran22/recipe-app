# Nest Journey Documentation
In this document i will be recording my journey in nest and how idelved deep into its core and design patrerns concepts
<br>
<br>
Ps: i will be using postgres as my db and typeorm as my orm so results may differ if you use mysql or prisma for the orm 

# 1.Nest Basics
Te basic building blocks in nest are these three basic blocks:

## Modules
Modules wrap logic of a certain domaine or lets say entity in pr example we have a recipe module that groupes the recipe controller and providers and bundles them to be used as one entity in the other modules its a way to wrap logic in one place

```typescript
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
```
in this example we define the class for the recipe module that holds all the logic for the recipes domaine and all what the recipe domain needs in the imports.

## Controllers
they are classes that handle end points and req res logic they are responsible for handling end point logic as i understood 

```typescript
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { Get, Post, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RecomendRecipeDto } from './dto/recomend-recipe/recomend-recipe.dto';
@Controller('recipes')
export class RecipesController {
  constructor(private readonly reciperService: RecipesService) {}
  @Get()
  async getRecipes(@Query() paginationQuery: PaginationQueryDto): Promise<Recipe[]> {
    return this.reciperService.getAllRecipes(paginationQuery);
  }
}
```

in this example we are defining an http endpoint that gets all recipe its responsible for handling the incoming get request fro the user and it calls the service method for this so controllers call services to handle logic which lead us to the nest point.

## Services(Providers)

they classes that handles business logic , they define the methods that will be called in the controller for a request handling for example we define our gettAllRecipes methode inside the recipe service for handling as follows:

```typescript
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { RecomendRecipeDto } from './dto/recomend-recipe/recomend-recipe.dto';
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    private readonly dataSource: DataSource,
    
  ) {}

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
}
```
you notcie that we are using injectable repositories those will be covered in the next section, but to explain briefly the method is calling the repository for this domain to get all the data from teh DB.

## Decorators
they are an important feature in nest 99% of the data uses decorators, they are functions that provides meta data for variables or types or functions.they are basically logic blueprints for functions/vars/types.
<br>
for example:
```typescript
 @Get()
  async getRecipes(@Query() paginationQuery: PaginationQueryDto): Promise<Recipe[]> {
    return this.reciperService.getAllRecipes(paginationQuery);
  }
```
in the recipe controller we are using the Get decorator that tells nest handler that this function will handle the get method only.<br>
and we are using the Query decorator to tell the function that the paginationQuery is expected to be in the url of the request and will throw an error if there was any issue with that.

## Repository
this is a basic design pattern its a deign patter that nest uses heavily alongside Dependency injection.<br>

This pattern is used for defining methods for a certain domain that will handle the data fetching from the db in our example the recipe repo are all the methods that will be used for fetching recipes and writing new ones to the db.

## Dependency Injection
this is the mots used design patern by far its used heavily for defining relationships between objects lets say a method or a class needs anpther class instance the Injectable decorator will handle that for us .<br>
 
 for exmaple in the recipes service we are injecting the recipe repository service to the constructor of the recipe service
 ```typescript
 @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>
```
it means here that we are using the recipe repository instance and passing the handling of this njection to nest itself.


# 2.TypeOrm Specifications 

## Entities
entities arethe basic building blocks they are the equivilant of the data abse schema for the db they define just that and they define relationships to other entities(tables).<br>

for example 
```typescript
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Difficulty } from "./difficulty.entity";
//we define the entity with the entity decorator
@Entity('recipes')
export class Recipe {
    //this is a simple decorator to tell the db that the id is primary and its a generated uuid
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string
    //the columns decorator do juts as it says it defines a the property as a column 
    @Column()
    description:string
    
    @Column({default : 0})
    recomendations: number

    @Column()
    image:string

    @Column()
    cookTime:number
    //here we are creating a join from the recipe table to always get the difficulty and it know its a refrence to another table we do this only from the owner relationship
    //meaning only the the one that will have the foreign key
    @JoinTable()
    //her ewe define the tpe of the relationship with this decorator with many to one and we give the name of the entity that we are relating to in a callback function  aand we are giving the name in the second function that we want to tell it that the recipe in the other side is named difficulty.recipes(this is the inverse relationship)
    @ManyToOne(() => Difficulty, (difficulty) => difficulty.recipes, {
        cascade: true,
        eager: true//we do this to always get the difficulty without specifying if we want to get them 
    })
    difficulty:Difficulty

    @Column()
    servings :number

    @Column()
    category :string

    @Column("text", { array: true })
    ingredients: string[]

    @Column("text", { array: true })
    instructions: string[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt : Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt : Date
}
```

## Data Transfer Objects (DTOs)
They are the backbone of modern APIs they define the data transfered between apis and requests for example if we want to create the recipe we wont let the user craete the metadat of that object for example the **Id** and **create_at** and **updated_at** these will be created by the db, so we create DTOs to define this schema for example :
```typescript
 import { IsString, IsNumber } from "class-validator";

export class CreateRecipeDto {
  @IsString()
  readonly name: string;
  
  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;

  @IsNumber()
  readonly cookTime: number;

  @IsString()
  readonly difficulty: string;
  @IsNumber()
  readonly servings: number;

  @IsString()
  readonly category: string;

  @IsString({ each: true })
  readonly ingredients: string[];

  @IsString({ each: true })
  readonly instructions: string[];
}
```
As you can see we took off the **id** and the **create_at** and **updated_at** so for we expect to reciev a josn object n this schema and these are not eetities they dont have to do with the data base.

But if you can see we are validating the input by creating a validation pipe we will explain it in the next chapter.

## Validation Pipe
its a pipe that handles validations , its a config objec that tells nest what to expect in our requests, we define them in the main app .<br>

for example 
```typescript
app.useGlobalPipes( new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    },//this will help to use the types of ts rather then implicitly defining them 
    whitelist : true,// this will llow only accespted value and ignores the new attribues in the requests and res 
    forbidNonWhitelisted : true,//this will throw an error if it recived an unwanted attribute
    transform : true,//this will istanciate the javascript object that we get through the requests into its current dto 
  }))
```

and then we can use decorators in our DTOs to verfiy incoming input


# Migrations

this will document how we create migrations in typeorm 
Migrations are like git commits they for version controll of the DataBase schema.<br>

It prevents Data Loss by changing the schema and keeping the data in a safe way and with rollbacks enabled

---

## Creating a Migration
``` bash
//we crate a migration with this command and give it a name 

npx typeorm migration:create src/migrations/MigrationName
```

## Defining what the migration functionality and rollbacks

```typescript
//in the migration file that we find in path
//  we have given when creating it
import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeRefactor1759449133300 implements MigrationInterface {
    //first in this methde we define what the migration
    //would do in our case it would change the schema 
    //from name to title in the recipe table
    //without data loss 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "recipes" RENAME COLUMN "name" TO "title"'
        )
    }
    //this method will define the rollback if we want 
    //to rollback the changes 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "recipes" RENAME COLUMN "title" TO "name"'
        )
    }

}
```
## Running the Migration 

To run the migration first you need to define a data source file for storing the information about the db and connection string and the migration locations and all the necissary infos like in the src/data-source.ts

```typescript
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1111',
  database: 'recipe_nest',
  entities: ['dist/**/*.entity.js'],//we define our schema here 
  migrations: ['dist/migrations/*.js'],//we locate the migrations here
  synchronize: false,
});
```

Then you eun this command to commit the migration 
 
```bash
npx typeorm migration:run -d <Data Source file path>
```