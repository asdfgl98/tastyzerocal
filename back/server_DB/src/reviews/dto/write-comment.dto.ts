import { IsString } from "class-validator";

export class WriteCommentDTO {
    @IsString()
    postId: string

    @IsString()
    comment: string
}