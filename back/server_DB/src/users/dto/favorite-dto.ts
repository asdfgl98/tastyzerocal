import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class FavoriteDTO {
    @IsObject()
    @IsOptional()
    _id: Types.ObjectId

    @IsString()
    @ApiProperty({example:'6540656', description: '가게 id'})
    id: string

    @IsString()
    @ApiProperty({example:'123식당', description: '가게 이름'})
    place_name: string

    @IsString()
    @ApiProperty({example:'한식', description: '가게 카테고리'})
    category_name: string

    @IsString()
    @ApiProperty({example:'광주 북구 12대로 34번길', description: '가게 주소'})
    road_address_name: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({example:'062-1234-5678', description: '가게 번호'})
    phone: string | null
    
    @IsString()
    @ApiProperty({example:'https://123식당', description: '가게 페이지'})
    place_url: string

}