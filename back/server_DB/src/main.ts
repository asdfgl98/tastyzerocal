import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'
import { REVIEWS_IMAGE_PATH } from './common/const/path.const';

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

  await app.listen(process.env.PORT, ()=>{
    // 1주일에 한 번 실행되는 주기 (밀리초 단위)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
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
