import { Controller, Get, Param, Query } from '@nestjs/common';
import { KakaomapsService, MapInfoState } from './kakaomaps.service';

@Controller('kakaomaps')
export class KakaomapsController {
  constructor(private readonly kakaomapsService: KakaomapsService) {}

  @Get("/keywordSearch")
  keywordSearch(@Query() data: {searchword: string}): Promise<MapInfoState[]> {
    return this.kakaomapsService.keywordSearch(data.searchword);
  }

  @Get("/categorysearch")
  categorysearch(@Query() data:{x: string, y: string}): Promise<MapInfoState[]>{
    return this.kakaomapsService.categorysearch(data)
  }
}
