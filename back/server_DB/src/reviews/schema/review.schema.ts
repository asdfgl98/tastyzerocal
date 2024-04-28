import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types, Schema as MongooseSchema } from "mongoose";
import { Comment } from "./comment.schema";
import { CommentType } from "src/Types/type";



@Schema()
export class Review {
    @Prop({
        required: true
    })
    title: string

    @Prop({
        type: Object,
        required: true
    })
    store: any

    @Prop()
    category: string[]

    @Prop()
    tag: string[]
    
    @Prop({
        required: true
    })
    content: string

    @Prop()
    image: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    createBy: Types.ObjectId

    @Prop({
        default: Date.now
    })
    createdAt: Date

    @Prop({
        default: Date.now
    })
    updatedAt: Date

    @Prop()
    comments: CommentType[]

    @Prop({
    })
    likeCount: string[]

    @Prop({
        type: Number,
        default: 0
    })
    viewCount: number
}

export const ReviewSchema = SchemaFactory.createForClass(Review)