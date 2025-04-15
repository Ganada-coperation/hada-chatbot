import {BaseSchema} from "../../../common/base/base.schema";
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatSession extends BaseSchema {
    @Prop({ required: true })
    kakaoUserId: string; // 카카오 사용자 ID (botUserKey)

    @Prop({ default: false }) // 대화 종료 여부
    isFinished: boolean;

    @Prop({ default: Date.now }) // 대화 종료 시간
    finishedAt: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
export type ChatSessionDocument = ChatSession & Document;