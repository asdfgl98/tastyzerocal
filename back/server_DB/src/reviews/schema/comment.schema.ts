import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";


export class Comment {
    @Prop({
        required: true,
        unique: true
    })
    commentId: string

    @Prop()
    postId: string

    @Prop()
    userId: string

    @Prop()
    userName: string

    @Prop()
    comment: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)