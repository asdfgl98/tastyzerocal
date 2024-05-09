import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { MapInfoState } from "src/Types/type";

export class CreateReviewDTO {
    @IsString()
    @ApiProperty({example:'맛집 추천', description: '리뷰 제목'})
    title: string

    @IsObject()
    @ApiProperty({example: '가게 ID, 가게 이름 등..', description: '가게 정보'})
    store: MapInfoState

    @IsArray()
    @ApiProperty({example:'["한식", "면"]', description: '가게 카테고리'})
    category: string[]

    @IsArray()
    @ApiProperty({example:'["매운", "분위기 좋은"]', description: '가게 태그'})
    tag: string[]

    @IsString()
    @ApiProperty({example:'맛집 추천합니다.', description: '리뷰 내용'})
    content: string

    @IsArray()
    @IsOptional()
    @ApiProperty({example:'이미지URL', description: '음식 이미지'})
    image: string[]

    
}