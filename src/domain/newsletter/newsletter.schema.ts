import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {BaseSchema} from "../../common/base/base.schema";

@Schema({ timestamps: true })
export class Newsletter extends BaseSchema {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: Date.now })
    subscribedAt: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
export type NewsletterDocument = Newsletter & Document;

