import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true,
    },//this will help to use the types of ts rather then implicitly defining them 
    whitelist : true,// this will llow only accespted value and ignores the new attribues in the requests and res 
    forbidNonWhitelisted : true,//this will throw an error if it recived an unwanted attribute
    transform : true,//this will istanciate the javascript object that we get through the requests into its current dto 
  }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors({ 
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  //this is fr docuemntation using nest and swagger

  const config = new DocumentBuilder()
    .setTitle('Recipes API')
    .setDescription('API for managing recipes')
    .setVersion('1.0')
    .addTag('recipes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
   app.use(
    '/api-docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',  // purple, moon, kepler, saturn, bluePlanet
      darkMode: true,
      layout: 'modern',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
