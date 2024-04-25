import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { REVIEWS_IMAGE_PATH } from './const/path.const';
import {v4 as uuid} from 'uuid'

@Module({
  imports:[
    MulterModule.register({
      // 파일용량
      limits: {
        fileSize: 10000000
      },
      fileFilter: (req, file, cb)=>{      
        const ext = extname(file.originalname) // 파일명에서 확장자 추출
        // cb() 첫번째 파라미터는 에러 콜백함수
        // 두번째 파라미터는 파일을 받을지 말지 boolean 값
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false
          )
        }
        return cb(null, true)
      },
      storage: multer.diskStorage({
        destination: function(req, res, cb){
          cb(null, REVIEWS_IMAGE_PATH)
        },
        filename: function(req, file, cb){
          cb(null, `${uuid()}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
