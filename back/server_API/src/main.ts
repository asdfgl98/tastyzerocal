import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
    origin: [process.env.FRONT_ORIGIN, process.env.DOMAIN_NAME] , 
    credentials: true}
  });

  app.use(
    ['/api-description'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_ID]: process.env.SWAGGER_PASSWORD
      }
    })
  )

  // swagger 문서 빌드를 위한 config
  const config = new DocumentBuilder()
    .setTitle('tzc API Server')
    .setDescription('tzc API Server API description')
    .setVersion('1.0')
    .addTag('tzc API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      in: 'header',
    },)
    .build()

  // config를 바탕으로 swagger document 생성
  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI에 대한 path를 연결함
  // .setup('swagger ui endpoint', app, swagger_document)
  SwaggerModule.setup('api-description', app, document);


  await app.listen(process.env.PORT);
}
bootstrap();
