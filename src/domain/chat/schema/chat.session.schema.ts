import {BaseSchema} from "../../../common/base/base.schema";
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document } from 'mongoose';

@Schema()
export class ChatSession extends BaseSchema {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ default: false }) // 대화 종료 여부
    isFinished: boolean;

    @Prop({ default: Date.now }) // 대화 종료 시간
    finishedAt: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
export type ChatSessionDocument = ChatSession & Document;