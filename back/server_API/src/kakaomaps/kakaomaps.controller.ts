import { Controller, Get, Param, Query } from '@nestjs/common';
import { KakaomapsService, MapInfoState } from './kakaomaps.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('kakaomaps')
@ApiTags('kakaomaps Controller')
export class KakaomapsController {
  constructor(private readonly kakaomapsService: KakaomapsService) {}

  @Get("/keywordSearch")
  @ApiOperation({summary: '카카오 맵 키워드 검색', description: '카카오 API를 통해 키워드로 음식점을 검색합니다.'})
  @ApiResponse({status: 200,description: '키워드 기반 음식점 데이터'})
  @ApiQuery({name: 'searchword', description: '검색어를 입력해주세요'})
  keywordSearch(@Query() data: {searchword: string}): Promise<MapInfoState[]> {
    return this.kakaomapsService.keywordSearch(data.searchword);
  }

  @Get("/categorysearch")
  @ApiOperation({summary: '카카오 맵 카테고리 검색', description: 'xy 좌표로 카카오 API를 통해 카테고리로 음식점을 검색합니다.'})
  @ApiResponse({status: 200,description: '카테고리 기반 음식점 데이터'})
  @ApiQuery({name: 'x', description: 'x 좌표',})
  @ApiQuery({name: 'y', description: 'y 좌표',})
  categorysearch(@Query() data:{x: string, y: string}): Promise<MapInfoState[]>{
    return this.kakaomapsService.categorysearch(data)
  }
}
