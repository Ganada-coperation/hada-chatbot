import {ChatService} from "../../chat/service/chat.service";
import {HttpService} from "@nestjs/axios";
import {UserSessionService} from "../../user/user-session.service";
import { Process, Processor } from '@nestjs/bull';
import {Job} from "bull";
import {firstValueFrom} from "rxjs";
import {KakaoResponseDto} from "../kakao.dto";
import {UserService} from "../../user/user.service";
import {ChatDataService} from "../../chat/service/chat.data.servivce";
import {GeneratedContent} from "../../chat/schema/generated.content.schema";
import {GeneratedContentService} from "../../chat/service/generated.content.service";

@Processor('articleQueue')
export class ArticleProcessor {
    constructor(
        private readonly generatedContentService:GeneratedContentService,
        private readonly chatDataService: ChatDataService,
        private readonly httpService: HttpService,
        private readonly userService: UserService,
    ) {
        console.log('✅ ArticleProcessor 생성됨');
    }

    @Process('generateArticle')
    async handle(job: Job<{ userId: string; callbackUrl: string }>) {
        const { userId, callbackUrl } = job.data;

        console.log(`🟡 [큐 작업 시작] userId=${userId}`);

        // 사용자 ID가 없으면 새로운 사용자를 생성
        await this.userService.findOrCreateByKakaoUserId(userId);

        // 이전 대화 내역 조회
        const chatHistory = (await this.chatDataService.getOnlyUserMessages(userId)).join('\n');

        // 글 생성
        const generatedContent:GeneratedContent = await this.generatedContentService.generateContent(chatHistory, userId);

        // 생성된 글을 문자열로 변환
        const article = this.convertGeneratedContentToString(generatedContent);

        // 최종 응답
        const finalResponse = `💌💌💌\n${article}\n💌💌💌\n\n하다가 당신의 이야기를 바탕으로 글을 작성해봤어요!\n이 글이 뉴스레터로 다른 사람들과 공유되기 원한다면 아래 링크로 접속해 글 제출을 해주세요!\nhttps://hada.ganadacorp.com/write/${generatedContent.generatedPostId}`;

        // 이전 대화 내역 삭제
        await this.chatDataService.finishSession(userId);

        const kakaoResponse = this.formatKakaoResponse(finalResponse)

        // 카카오톡에 응답 전송
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

    // GeneratedContent 글로 변환
    private convertGeneratedContentToString(generatedContent:GeneratedContent): string {
        return `제목\n${generatedContent.title}\n\n내용\n${generatedContent.content}\n`;

    }
}
