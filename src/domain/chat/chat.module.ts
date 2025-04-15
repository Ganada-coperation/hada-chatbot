import { Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { OpenAIModule } from '../../infrastructure/openai/openai.module';
import {ChatDataService} from "./service/chat.data.servivce";
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "../post/post.schema";
import {ChatMessage, ChatMessageSchema} from "./schema/chat.message.schema";
import {ChatSession, ChatSessionSchema} from "./schema/chat.session.schema";
import {GeneratedContent, GeneratedContentSchema} from "./schema/generated.content.schema";
import {GeneratedContentService} from "./service/generated.content.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }
        , {name: ChatSession.name, schema: ChatSessionSchema}
        , {name: GeneratedContent.name, schema: GeneratedContentSchema}])
        , OpenAIModule],
    providers: [ChatService, ChatDataService, GeneratedContentService],
    exports: [ChatService, ChatDataService, GeneratedContentService],
})
export class ChatModule {}
