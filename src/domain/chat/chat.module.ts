import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { OpenAIModule } from '../../infrastructure/openai/openai.module';
import {ChatDataService} from "./chat.data.servivce";
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "../post/post.schema";
import {ChatMessage, ChatMessageSchema} from "./schema/chat.message.schema";
import {ChatSession, ChatSessionSchema} from "./schema/chat.session.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }
        , {name: ChatSession.name, schema: ChatSessionSchema}])
        , OpenAIModule],
    providers: [ChatService, ChatDataService],
    exports: [ChatService, ChatDataService],
})
export class ChatModule {}
