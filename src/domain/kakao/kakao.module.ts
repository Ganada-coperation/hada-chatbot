import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [ChatModule],
    controllers: [KakaoController],
})
export class KakaoModule {}
