# Nest Journey Documentation
In this document i will be recording my journey in nest and how idelved deep into its core and design patrerns concepts
<br>
<br>
Ps: i will be using postgres as my db and typeorm as my orm so results may differ if you use mysql or prisma for the orm.
I Acknowledg that the examples provided in this document arent the best practices for example the difficulty as a table( we would usually use an enum and many more) but its for learning purpouses

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

and then we can use decorators in our DTOs to verfiy incoming input.And the nest runtime handles all the error thows.

# 3.Manipulating Realted Data

To Manipulate Related Data in our case we need to create a certain recipe and its difficulty object from the Difficulties table we need to preload them to see if it does exist or ot if it does we load it and send it with the recipe and if not we create it with this methode 
```typescript
private async preloadDifficultyByLevel(level: string): Promise<Difficulty> {
    const existingFlavor = await this.difficultyRepository.findOne({
      where: { level },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.difficultyRepository.save({ level });
  }
  ```
  Then we call it in the create method as follows 
```typescript
async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
    const difficulty = await this.preloadDifficultyByLevel(data.difficulty);//we preload the diff here before creating the recipe to insure a unique diff exists so one 
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
```  
# 4.Simple Crud Operations:

create has been dealt with in the prev chapter

## Reads
To Read from the db you simply use the repository object provided by typeorm as follows 
```typescript
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
  ```
small note
you can see that we ae using a pagination query we will talk about this in the **pagination section** 

## Update 

we Update data with two methods 
### Update function method

we use the update function to update the data directly and let typeorm handle that but the issue with this approach is that the cascading options for having multiple relations wont be handled prperly meaning that if we updated the recipe with the new difficulty it will only update the refrence key and not the actual object lets say we have a new difficulty in th recipe that doesnt exist that will cause an issue because it cant cascade the creation its a simple update 

```typescript
// Scenario 1: Update with EXISTING difficulty ID
await recipeRepository.update(recipeId, {
  difficulty: { id: 3 } // exists in DB
});
// ✅ Works - just updates the foreign key

// Scenario 2: Update with NEW difficulty object
await recipeRepository.update(recipeId, {
  difficulty: { name: 'Super Hard', level: 5 } // doesn't exist yet!
});
// ❌ FAILS - update() can't cascade create the new difficulty
// It's just a simple UPDATE statement, not entity-aware
```

### Preload Save Method

this is generally the safest option when you are dealing with related data, its seperated into two simple steps 

**1.** we preload the related data in this case the difficulty but
```typescript
 const difficulty = data.difficulty && (await this.preloadDifficultyByLevel(data.difficulty)); // we do this prealod to verify of the diff exists beforehand if not we create new one
```

**2.** we preload the data (we do a SELECT query) and load the data in memeory.

```typescript
const recipe = await this.recipeRepository.preload({
      id: id,
      ...data,
      difficulty: difficulty || undefined,
    }); //we preload to not have issues with exitance you see this is the safer way
```

**3.** then we save the cahnges with save function 
```typescript
    const result = await this.recipeRepository.save(recipe);
```
notice that this is oversimplifies you need to handle the errors too here is the fll demonstration of the service function
```typescript
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
```

## Delete Function 
To Delete a recipe simply we delete the recipe in out ase we dont need to cascade the delete because the if we delete the recipe we dont expect the difficulty to be deleted from the difficulty table.

```typescript
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
```

# 4.Basic Error Handling

We can do basic error handling with try catch blocks nothing to new in that but we have a new thing we can customize the error thrown by using these new Error types 

```typescript
throw new NotFoundException('Recipe not found');
throw new HttpException('Error deleting recipe', 500);
//and many more 
```
# 5.Transactions
Transactions are soo important to understand in data bases they bascially a bunch of queries that happens at once and if one of them dont succeed the whole batch of opertaion will notbe accepted and the changes willbe rolled back 

we define it by creaing a data object called a query runner. 
we create it from the DataSource Object class from typeorm. 

we create one with that datasrouce we connect using one of our connections in the connections pool, then we start recoring the transaction.

Think of it as a to do list or a book of orders in our example below we will define bulk recipe creation,  by registering each recipe creation function and setting it up and then if one of them failed we stop the transaction and roll back the changes.


```typescript
async createBulkRecipes(recipes: CreateRecipeDto[]): Promise<Recipe[]> {
    if (recipes.length === 0) {
      throw new HttpException('No recipes to insert', 400);
    }

    //we define the query runner here 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdRecipes: Recipe[] = [];
      const difficultyLevels = [
        ...new Set(recipes.map((recipe) => recipe.difficulty)),
      ];//we create a simple set for all the difficutlies to not do somany preloads request to the db
      const difficulties = await Promise.all(
        difficultyLevels.map((level) => this.preloadDifficultyByLevel(level)),
      );//we request the difficulties needed in the recipes 

      const difficultyMap = new Map<string, Difficulty>();
      difficulties.forEach((diff) => difficultyMap.set(diff.level, diff));//we put them in a map for easier access by level as the key

      for (const recipeData of recipes) {
        //in this loop we will register all the transactions that we need 
        const difficulty = difficultyMap.get(recipeData.difficulty);
        if (!difficulty) {
          throw new HttpException(
            `Difficulty ${recipeData.difficulty} not found`,
            400,
          );
        }
        //we save the create function to the query runner here 
        const recipe = queryRunner.manager.create(Recipe, {
          ...recipeData,
          difficulty,
        });
        //we save the save funcion to the query runner here 
        const savedRecipe = await queryRunner.manager.save(recipe);
        createdRecipes.push(savedRecipe);
      }

      await queryRunner.commitTransaction();
      return createdRecipes;
    } catch (error) {
      //we roll back the changes if one of them didnt work 
      await queryRunner.rollbackTransaction();

      console.log(error);
      throw new HttpException('Error inserting bulk recipes', 500);
    } finally {
      //we release the connection and giving it back to the pool to be used (ps this is the lock concept from systems programing) 
      await queryRunner.release();
    }
  }
  ```
  To put it simply, we are just registering a bunch of queries and executing them at once like this:

- Create recipe1
- Save recipe1
- Create recipe2
- Save recipe2
- ... and so on

# 6.Pagination
Pagiation is a common practice in backend systems, its goal is to help reduce qeury data gotten on the db for example instead of getting the whole data from the db especially if you have thusands or milions of rows in the case of postgres from previous tests when it cracks the 10 thousands it starts to take noticablly longer time.<br>

- So to counter act this we use pagination to get a specific **Page** from the Data base hence the name **Pagination** we get a limited chunk of the db lets say from row 15 to row 20.<br>

- we do this by sending in the query parameters the limit and offset the limit represents the max ammount of data we can get , the offset represents how much data we need to skip to a certain row.<br>

- Note that for this to work we need to order the data because postgres doesnt retain the order of elements if you used a uuid id it my do that if its incremental id.

```typescript
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
```
Note we need to define a DTO for the pagination in our case its gonna be as simple as a limit and an offset but this approach can change depending on your needs 
```typescript
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit: number;

    @IsOptional()
    @IsPositive()
    offset: number;
}
```

# 7.Simple Event Handling
Event handling is the way that we can record events that happend in our app for example if our user recomeds a recipe we need to save that event to the data abse and increment the recomendations too.

for this we need to create a new entity to save events.
```typescript
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['name', 'type'])
@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column({type: 'json'})//this payload will be the event specific data its not ormalized in this case 
    payload: Record<string, any>;
}
```
then to save an event we use the Transaction model we discussed earlier 
to increment the recomendations number in the recipe and to record that speicific event.
```typescript
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
```
- Note that in such cases its better to use NoSQL data bases because frequesnt updates can hurt performance to the db generally in the case of likes and follows for example in a socila media platform you should use a NoSQL DB for such workloads or you can mix and match Db even using redis.



# 8.Migrations

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


# 9.Dependency Injection Deeper Analysis:

Dependency injection is handled by Nest's Ioc Container, which a global container or runtime in the nest app that coordinates between DI Containers, and those containers are modules based containers that handles the Dependency injection for that single module only and then Ioc System coordinates with them.

In Short, Ioc Container has the global dependency graph that shows what modules depened on and what providers need as dependencies, then it manages calls recursivly from diffrent modules which ask for here respective dependencies.

To handle these calls, Nests' Ioc COntainer contains a  map of all cached provider's Instances Map<Token, Instance> , this map is created as follows:
 - A modules asks for providers before being loaded.
 - if the provider doesnt exist Nest's Ioc Container creates a singleton instance of that provider.
 - saves it in an in memory cahce using js objects.
 - identifies it with a token in the map.


```bash
AppModule (Root Injector)
│
├── UsersModule (Injector)
│     ├── UsersService
│     └── UsersRepository
│
├── AuthModule (Injector)
│     ├── AuthService(Calls later ConfigService)
│     └── JwtService
│
└── SharedModule (Injector)
      └── ConfigService
```

- In this Example the App module is loaded so Nest create a DI Container for it
- Then the App modules needs UserModule as its dependency so Nest creates a new DI Container to handlethe Injection of UserModule

- User Module Depends on UserService and UserRepo so its DI Container creates the instance of the class and passes it to the Ioc Container to be cahced in the Map , same with UserRepo

- AuthModule will have the same effect as UserModule but with a catch the AuthService depends on SharedModule's ConfigService so what does it do the DI container of AuthModule calls the Shared Module DI Container which this is orchestraited by the global Ioc container, to request the instance of the ConfigService.

# 10.Providers Scopes And Dynamic Modules
## a.Providers Scope;

we define a provider scope as the type of inantitation for that provider when its injected in other dependencies, we find three scopes:

### Default:
The default one is a singleton instance of the class and its the default behaviour for the provider and the most recomended one due to meemory optimization as we will see the other modules are not memory efficient.

### Transient:
Transient scope is for each time the provider is injected into a consmer, it will create a unique instance for that specific consumer, its mainly used for loggers when we want the loggers to be unique for each.
```typescript
@Injectable({scope: Scope.TRANSIENT})
class LoggerService {
  log(message: string) {
    console.log(message);
  }

}
```

### Request
Request scope, is we instanciate the provider for each request and as you can see thiw will be a nightmare for memory because for each incoming request we instantiate the provider so if we have a 3 thousand requests at one time we would have 3 thousand active providers, and side note they are garbage collected so after the end of each request the provider will be deleted. The special feture about this scope is that you will have access to the request object and it can be injected directly into any dependency.
```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  constructor(@Inject(REQUEST) private request: Request) {}

  getRequestId() {
    return this.request.headers['x-request-id'] || uuidv4();
  }
}

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  constructor(private context: RequestContext) {}

  log(message: string) {
    console.log(`[${this.context.getRequestId()}] ${message}`);
  }
}
```

### Warning 
Provider scopes do bubble up onto the chain of the dependencies so if the scope of the consumer that inject and uses that provider , imagine if we have UserService service class and its of scope request , the controller that will use this service will also be request so it will be instanciated for each request so that is a big nightmare for the memory.

## b.Dynamic Modules 
dynamic modules represent flexible non static modules that will behave like a plugin system , lets say you need a module that depends on env vars that module wont be static but dynamic.

```typescript
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class MyDynamicModule {
  static register(options: { apiKey: string }): DynamicModule {
    return {
      module: MyDynamicModule,
      providers: [
        {
          provide: 'API_KEY',
          useValue: options.apiKey,
        },
      ],
      exports: ['API_KEY'],
    };
  }
}
```
```typescript 
@Module({
  imports: [
    MyDynamicModule.register({
      apiKey: '12345-SECRET-KEY',
    }),
  ],
})
export class AppModule {}
```

# 11.Config Module
This is how nest handle diffrent env configurations
we start by installing it 
```bash
npm i @nestjs/config
```
we need to register this module in the app module like so we can pass some propreties like **isGlobal** if we want to make it Globaly used by our app 

As the best practice to use ConfigureModule by using it with the ConfigService when working with the env file if you are working with custom config files there is another treatement.
```typescript
@Module({
  imports: [RecipesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

      })
    })
    ,TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      })
    
  })],
})
```

Notice that we are using ConfigService with get and injecting it using the useFactory , we use Joi in the configModule for defineing a clear schema that we want to use in our .env file.

But we dont usually want to use one env file , we can use multiple config files for speicifc domains , lets say the recipes domain need some kind of specific configurations. 

Nesxt we will see how we handle this by creating specific config files and injecting there values with the ConfigService and ConfigModule as follows.

- Suppose we have some kind of config in the recipes domain like this in the recipe.config.ts

```typescript
import { registerAs } from "@nestjs/config"

export default registerAs('recipes', () => ({
    coffeeApiKey: "the api key that would be in the env ",
    coffeeApiUrl: "The Url that would be i the env",
}))
```
we use the register as method to createthis **namespace** this will later be injected in the service we need to use it in 

```typescript

export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    private readonly dataSource: DataSource,
    @Inject(CUISINES) private readonly cuisines: string[], //i will keep this here to showcase how we inject custom providers through the app 
    @Inject(recipesConfig.KEY)
    private readonly recipesConfiguration: ConfigType<typeof recipesConfig>
  ) {
    /*notice that here it gives ud full control over
    labels inside of the recipesConfiguration we can 
    access them in a typesafe way*/ 

    console.log(recipesConfiguration.coffeeApiKey)
  }
}
```

