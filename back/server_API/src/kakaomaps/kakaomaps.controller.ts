import { Controller, Get, Param, Query } from '@nestjs/common';
import { KakaomapsService, MapInfoState } from './kakaomaps.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('kakaomaps')
@ApiTags('kakaomaps Controller')
export class KakaomapsController {
  constructor(private readonly kakaomapsService: KakaomapsService) {}

  @Get("/keywordSearch")
  @ApiOperation({
    summary: '카카오 맵 키워드 검색', 
    description: '카카오 API를 통해 키워드로 가게를 검색합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '키워드 기반 음식점 데이터'
  })
  @ApiBearerAuth()
  keywordSearch(@Query() data: {searchword: string}): Promise<MapInfoState[]> {
    return this.kakaomapsService.keywordSearch(data.searchword);
  }

  @Get("/categorysearch")
  categorysearch(@Query() data:{x: string, y: string}): Promise<MapInfoState[]>{
    return this.kakaomapsService.categorysearch(data)
  }
}
