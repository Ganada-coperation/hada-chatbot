import {forwardRef, Module} from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { ChatModule } from '../chat/chat.module';
import {HttpModule} from "@nestjs/axios";
import {UserSessionService} from "./user-session.service";
import {ArticleQueueModule} from "./queue/article-queue.module";
import {BullModule} from "@nestjs/bull";

@Module({
    imports: [ChatModule, HttpModule,
        forwardRef(() => ArticleQueueModule),
        BullModule.registerQueue({ name: 'articleQueue' }),],
    controllers: [KakaoController],
    providers: [UserSessionService],
    exports: [UserSessionService],
})
export class KakaoModule {}
