import { Controller, Get, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { region } from './schema/region.schema';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('resource')
@ApiTags('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('/region')
  @ApiOperation({summary: '대한민국 지역명 데이터', description: '대한민국 지역명 데이터를 불러옵니다.'})
  @ApiOkResponse({description: '서울, 경기도, 강원도, 등..'})
  async getResion(): Promise<region[]> {
    return await this.resourceService.getResion()
  }

  // @Post('/')
  // createResion(): string{
  //   this.resourceService.createResion()
  //   return "생성완료"
  // }

}
