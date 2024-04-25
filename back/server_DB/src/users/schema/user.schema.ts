import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { FavoriteDTO } from "../dto/favorite-dto";
import { Favorite } from "./favorite.schema";

@Schema()
export class User {
    @Prop({
        required: true,
        unique: true
    })
    id: string;

    @Prop({
        required: true
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

    // @Prop({
    //     default: new Date()
    // })
    // createdAt: Date;

    // @Prop({
    //     type: Date,
    //     default: new Date()
    // })
    // updatedAt: Date;

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

}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.set('timestamps', {createdAt: true, updatedAt: true})


