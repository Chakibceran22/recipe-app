import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [RecipesModule,TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1111',
    database: 'recipe_nest',
    autoLoadEntities: true,
    synchronize: true,//this is for dev only because it updates each time the entities change in the db which wont happen in prod it adds soo much overhead
  })],
})
export class AppModule {}
