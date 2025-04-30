import {forwardRef, Module} from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { ChatModule } from '../chat/chat.module';
import {HttpModule} from "@nestjs/axios";
import {ArticleQueueModule} from "./queue/article-queue.module";
import {BullModule} from "@nestjs/bull";
import {UserModule} from "../user/user.module";
import {PostModule} from "../post/post.module";

@Module({
    imports: [ChatModule, HttpModule, UserModule, PostModule, ChatModule,
        forwardRef(() => ArticleQueueModule),
        BullModule.registerQueue({ name: 'articleQueue' }),],
    controllers: [KakaoController],
    providers: [],
    exports: [],
})
export class KakaoModule {}
