import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RecipesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
    ,TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT == undefined ? 5432 : parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'dbname',
    autoLoadEntities: true,
    synchronize: true,//this is for dev only because it updates each time the entities change in the db which wont happen in prod it adds soo much overhead
  })],
})
export class AppModule {}
