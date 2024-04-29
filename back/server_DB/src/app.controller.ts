import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { koreanTime } from './Utils/JWT-Utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  asd(){
    return koreanTime()
  }
}
