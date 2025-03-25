import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { OpenAIModule } from '../openai/openai.module';

@Module({
    imports: [OpenAIModule],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}
