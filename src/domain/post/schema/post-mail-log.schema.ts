import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // createdAt 자동 기록
export class SentPostMail {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    postId: string;
}

export type SentPostMailDocument = SentPostMail & Document;
export const SentPostMailSchema = SchemaFactory.createForClass(SentPostMail);
