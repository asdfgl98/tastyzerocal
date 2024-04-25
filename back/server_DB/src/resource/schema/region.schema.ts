import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type regionDocument = HydratedDocument<region>

@Schema()
export class region {
    @Prop({
        required: true,
        unique: true
    })
    koreaRegion: string;

    @Prop()
    city: string[];
}

export const regionSchema = SchemaFactory.createForClass(region)