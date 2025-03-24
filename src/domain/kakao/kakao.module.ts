import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { ChatModule } from '../chat/chat.module';
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [ChatModule, HttpModule],
    controllers: [KakaoController],
})
export class KakaoModule {}
