import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
