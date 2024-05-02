import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { MapInfoState } from "src/Types/type";

export class CreateReviewDTO {
    @IsString()
    title: string

    @IsObject()
    store: MapInfoState

    @IsArray()
    category: string[]

    @IsArray()
    tag: string[]

    @IsString()
    content: string

    @IsArray()
    @IsOptional()
    image: string[]

    
}