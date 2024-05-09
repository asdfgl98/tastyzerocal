import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { FavoriteDTO } from "../dto/favorite-dto";
import { Favorite } from "./favorite.schema";
import { koreanTime } from "src/Utils/JWT-Utils";

@Schema()
export class User {
    @Prop({
        required: true,
        unique: true
    })
    id: string;

    @Prop({
        required: true,
        unique: false
    })
    name: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    addressDetail: string

    @Prop({
        default: "normal"
    })
    loginType: string;

    @Prop({
        type: Object
    })
    token: {
        accessToken: string,
        refreshToken: string
    }

    @Prop([Favorite])
    favoriteList: FavoriteDTO[]

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Review',
    })
    likeList: mongoose.Schema.Types.ObjectId[]

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Review',
    })
    reviewList: mongoose.Schema.Types.ObjectId[]

}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.set('timestamps', {createdAt: koreanTime(), updatedAt: true})


