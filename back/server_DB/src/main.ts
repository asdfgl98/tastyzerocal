import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'
import { REVIEWS_IMAGE_PATH } from './common/const/path.const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.FRONT_ORIGIN, process.env.DOMAIN_NAME],
      credentials: true
      }
    });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  app.use(cookieParser())
  app.use(
    ['/api-description'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_ID]: process.env.SWAGGER_PASSWORD
      }
    })
  )


  const config = new DocumentBuilder()
    .setTitle('tzc DB Server')
    .setDescription('tzc DB Server는 MongoDB Atlas와 통신하며 Data를 관리하는 API 입니다.')
    .setVersion('1.0')
    .addTag('tzc DB')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      in: 'header',
    },)
    .build()
  
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api-description', app, document)


  await app.listen(process.env.PORT, ()=>{
    // 1주일에 한 번 실행되는 주기 (밀리초 단위)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    // 이미지 폴더 초기화
    setInterval(()=>{
      fs.rm(REVIEWS_IMAGE_PATH,{recursive: true}, (err)=>{
        if(!err){
          fs.mkdir(REVIEWS_IMAGE_PATH, (err)=>{
            if(err){
              console.error('reviews 폴더 생성중 오류 발생', err)
            }
          })
        }
        else{
          console.error('reviews 폴더 삭제중 오류 발생', err)
        }
      })
    },oneWeek)
    
  })
}
bootstrap();
