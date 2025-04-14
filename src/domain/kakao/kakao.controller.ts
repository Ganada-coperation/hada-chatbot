import {Controller, Post, Body} from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import {KakaoCallbackResponseDto, KakaoResponseDto, SkillPayloadDto} from './kakao.dto';
import {ApiBody} from "@nestjs/swagger";
import {UserSessionService} from "../user/user-session.service";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Controller('kakao')
export class KakaoController {
    constructor(private readonly chatService: ChatService,
                private readonly userSessionService: UserSessionService,
                @InjectQueue('articleQueue') private readonly articleQueue: Queue,
                ) {}

    // 카카오톡 챗봇 API
    @ApiBody({ type: SkillPayloadDto })
    @Post('chat')
    async receiveMessage(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userMessage = body.userRequest.utterance;
        const userId = body.userRequest.user.id;

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        this.userSessionService.ensure(userId);

        // 이전 대화 내역 조회
        const chatHistory = (await this.userSessionService.getHistory(userId)).join("\n");

        // 세션에 사용자 메시지 저장
        this.userSessionService.append(userId, userMessage);

        // 대화 기능 (ChatGPT 응답)
        const gptResponse = await this.chatService.chatWithGPT(chatHistory, userMessage);
        this.userSessionService.append(userId, gptResponse);

        // 카카오톡 응답 JSON 형식 변환
        return this.formatKakaoResponse(gptResponse);
    }

    // 채팅 바탕 글 생성 API
    @ApiBody({ type: SkillPayloadDto })
    @Post('create-article')
    async createArticle(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userId = body.userRequest.user.id;

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        this.userSessionService.ensure(userId);

        // 이전 대화 내역 조회
        const chatHistory = (await this.userSessionService.getHistory(userId)).join("\n");

        // 글 생성
        const article = await this.chatService.createArticle(chatHistory);

        // 글 형식 변환
        /*
        * (편지 이모지)(편지 이모지)(편지 이모지)
        * 생성된 글
        * (편지 이모지)(편지 이모지)(편지 이모지)
        *
        * 하다가 당신의 이야기를 바탕으로 글을 작성해봤어요!
        * 이 글이 뉴스레터로 다른 사람들과 공유되기 원한다면 아래 링크로 글을 보내주세요!
        * https://hada.ganadacorp.com/write
        * */
        const finalResponse = `💌💌💌\n${article}\n💌💌💌\n\n하다가 당신의 이야기를 바탕으로 글을 작성해봤어요!\n이 글이 뉴스레터로 다른 사람들과 공유되기 원한다면 아래 링크로 글을 보내주세요!\nhttps://hada.ganadacorp.com/write`;

        // 이전 대화 내역 삭제
        this.userSessionService.clear(userId);

        // 카카오톡 응답 JSON 형식 변환
        return this.formatKakaoResponse(finalResponse);

    }

    //  todo 서비스 로직으로 분리
    @ApiBody({ type: SkillPayloadDto })
    @Post('create-article/callback')
    async createArticleCallback(@Body() body: SkillPayloadDto): Promise<KakaoCallbackResponseDto> {
        const userId = body.userRequest.user.id;
        const callbackUrl = body.userRequest.callbackUrl;
        console.log('[DEBUG] callbackUrl:', callbackUrl);
        console.log('articleQueue 존재 여부:', this.articleQueue); // null or undefined이면 주입 안 됨
        console.log('등록할 큐 이름:', this.articleQueue.name);
        console.log('Redis 상태:', this.articleQueue.clients);
        console.log('등록할 데이터:', { userId, callbackUrl });

        // 글 생성 작업 큐에 추가
        // 큐 등록은 await 하지 않고 백그라운드로 실행
        this.articleQueue.add('generateArticle', { userId, callbackUrl })
            .then((job) => {
            console.log('큐 등록됨 jobId:', job.id);
        }).catch((e) => {
            console.error('큐 등록 실패:', e);
        });

        return this.formatKakaoCallbackResponse(
            '하다가 글을 생성하고 있어요!\n1분만 기다려 주시면 멋진 글을 만들어 드릴게요!',
        );
    }


    // 채팅 끝내기 (이전 채팅 내역 삭제) todo 일단 POST로 구현
    @ApiBody({ type: SkillPayloadDto })
    @Post('delete-chat')
    async deleteChat(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userId = body.userRequest.user.id;

        // 이전 대화 내역 삭제
        this.userSessionService.clear(userId);

        // 카카오톡 응답 JSON 형식 변환 todo : 안내 메시지 바꾸기
        return this.formatKakaoResponse("하다와 대화가 종료되었어요! 다시 대화를 시작하고 싶다면 하다에게 \"안녕\"이라고 보내보세요");
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

    // 카카오톡 콜백 응답 변환
    private formatKakaoCallbackResponse(text: string):KakaoCallbackResponseDto {
        return {
            version: "2.0",
            useCallback: true,
            data: { text: text }
        };
    }
}

// 사용자별 대화 세션 저장 (임시 저장소, Redis 적용 가능)
const userSessions: { [key: string]: string[] } = {};
