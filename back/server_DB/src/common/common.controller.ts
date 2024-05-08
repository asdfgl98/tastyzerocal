import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('common')
@ApiTags('common controller')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  @ApiOperation({summary: "multer 리뷰 이미지 선 업로드", description: "리뷰 작성 시 multer를 통해 이미지만 미리 서버에 업로드 합니다."})
  @ApiResponse({status: 201, description: '177b4630-9339-49d6-a885-5e4d58613a1c.png'})
  @ApiResponse({status: 413, description: 'Request failed with status code 413'})
  @UseInterceptors(FileInterceptor('image'))
  postImage(
    @UploadedFile() file: Express.Multer.File
  ){
    return file.filename
  }


}
