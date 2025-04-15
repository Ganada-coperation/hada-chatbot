import {BaseSchema} from "../../../common/base/base.schema";
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document } from 'mongoose';
import {SenderType} from "./chat.enum";

@Schema({ timestamps: true })
export class ChatMessage extends BaseSchema {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChatSession', required: true })
    session: Types.ObjectId;

    // 보낸 사람 ( 사용자 or 챗봇 )
    @Prop({ enum: SenderType, required: true })
    sender: SenderType;

    // 채팅 내역
    @Prop({ required: true })
    message: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
export type ChatMessageDocument = ChatMessage & Document;