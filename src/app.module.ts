import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { ChatModule } from './chat/chat.module';
import { KakaoModule } from './kakao/kakao.module';

@Module({
  imports: [OpenAIModule, ChatModule, KakaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

