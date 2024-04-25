import { Controller, Get, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { region } from './schema/region.schema';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('/region')
  async getResion(): Promise<region[]> {
    return await this.resourceService.getResion()
  }

  // @Post('/')
  // createResion(): string{
  //   this.resourceService.createResion()
  //   return "생성완료"
  // }

}
