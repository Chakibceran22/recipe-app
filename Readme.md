
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

## Migration generation

you can generate migrations by changing the entities in the nest entities folder and then typeorm will compare the entities with db schemas and will generate the right migrations with this command 

```bash
#first you need to build the new changes with
npm run build
# after that you can run the migrtation generat
npx typeorm migration:generate -n MigrationName
```
