import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema()
export class Favorite {
    @Prop()
    _id: Types.ObjectId

    @Prop({
        required: true
    })
    id: string

    @Prop({})
    place_name: string

    @Prop()
    category_name: string

    @Prop()
    road_address_name: string

    @Prop()
    phone: string | null
    
    @Prop()
    place_url: string

    @Prop({
        default: new Date()
    })
    addAt: Date


}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite)