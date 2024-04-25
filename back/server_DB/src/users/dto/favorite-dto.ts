import { IsObject, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class FavoriteDTO {
    @IsObject()
    @IsOptional()
    _id: Types.ObjectId

    @IsString()
    id: string

    @IsString()
    place_name: string

    @IsString()
    category_name: string

    @IsString()
    road_address_name: string

    @IsString()
    @IsOptional()
    phone: string | null
    
    @IsString()
    place_url: string

}