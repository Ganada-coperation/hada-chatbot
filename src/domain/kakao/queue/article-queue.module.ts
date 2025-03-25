import {BullModule} from "@nestjs/bull";
import {forwardRef, Module} from "@nestjs/common";
import {ChatModule} from "../../chat/chat.module";
import {HttpModule} from "@nestjs/axios";
import {ArticleProcessor} from "./article.processor";
import {KakaoModule} from "../kakao.module";

// todo 카카오 묘듈 참조 안하게 리펙토링하기
@Module({
    imports: [
        BullModule.registerQueue({ name: 'articleQueue' }),
        ChatModule,
        HttpModule,
        forwardRef(() => KakaoModule),
    ],
    providers: [ArticleProcessor],
    exports: [BullModule],
})
export class ArticleQueueModule {}