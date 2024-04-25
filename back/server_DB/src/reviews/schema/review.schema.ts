import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types, Schema as MongooseSchema } from "mongoose";
import { MapInfoState } from "src/Types/type";


@Schema()
export class Review {
    @Prop({
        default: new Types.ObjectId
    })
    _id: Types.ObjectId

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

    @Prop()
    imgUrl: string

    @Prop({
        default: Date.now
    })
    updatedAt: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review)