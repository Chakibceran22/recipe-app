import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { TimoutInterceptor } from './common/interceptors/timout/timout.interceptor';

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
  app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimoutInterceptor())
  app.enableCors({ 
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })


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
      theme: 'bluePlanet',  // purple, moon, kepler, saturn, bluePlanet
      darkMode: true,
      layout: 'modern',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason)
  // Log to monitoring, alert team, graceful shutdown
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  console.error('Shutting down due to uncaught exception')
  process.exit(1)
})
