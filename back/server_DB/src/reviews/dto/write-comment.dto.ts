import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class WriteCommentDTO {
    @IsString()
    @ApiProperty({example:'153643135', description: '리뷰 ID'})
    postId: string

    @IsString()
    @ApiProperty({example:'맛있어 보여요', description: '댓글 내용'})
    comment: string
}