import {ChatService} from "../../chat/chat.service";
import {HttpService} from "@nestjs/axios";
import {UserSessionService} from "../user-session.service";
import { Process, Processor } from '@nestjs/bull';
import {Job} from "bull";
import {firstValueFrom} from "rxjs";
import {KakaoResponseDto} from "../kakao.dto";

@Processor('articleQueue')
export class ArticleProcessor {
    constructor(
        private readonly chatService: ChatService,
        private readonly httpService: HttpService,
        private readonly userSessionService: UserSessionService,
    ) {
        console.log('✅ ArticleProcessor 생성됨');
    }

    @Process('generateArticle')
    async handle(job: Job<{ userId: string; callbackUrl: string }>) {
        const { userId, callbackUrl } = job.data;

        console.log(`🟡 [큐 작업 시작] userId=${userId}`);

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        this.userSessionService.ensure(userId);

        // 이전 대화 내역 조회
        const chatHistory = (await this.userSessionService.getHistory(userId)).join('\n');

        // 글 생성
        const article = await this.chatService.createArticle(chatHistory);

        // 최종 응답
        const finalResponse = `💌💌💌\n${article}\n💌💌💌\n\n하다가 당신의 이야기를 바탕으로 글을 작성해봤어요!\n이 글이 뉴스레터로 다른 사람들과 공유되기 원한다면 아래 링크로 글을 보내주세요!\nhttps://hada.ganadacorp.com/write`;

        // 이전 대화 내역 삭제
        this.userSessionService.clear(userId);

        const kakaoResponse = this.formatKakaoResponse(finalResponse)

        await firstValueFrom(this.httpService.post(callbackUrl, kakaoResponse));
    }

    // 카카오톡 응답 JSON 형식 변환 todo : 맵퍼로 빼기
    private formatKakaoResponse(text: string):KakaoResponseDto {
        return {
            version: "2.0",
            template: {
                outputs: [{ simpleText: { text: text } }]
            }
        };
    }
}
