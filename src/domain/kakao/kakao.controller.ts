import {Controller, Post, Body} from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import {KakaoCallbackResponseDto, KakaoResponseDto, SkillPayloadDto} from './kakao.dto';
import {ApiBody} from "@nestjs/swagger";
import { HttpService } from '@nestjs/axios';

@Controller('kakao')
export class KakaoController {
    constructor(private readonly chatService: ChatService,
                private readonly  httpService: HttpService) {}

    // 카카오톡 챗봇 API
    @ApiBody({ type: SkillPayloadDto })
    @Post('chat')
    async receiveMessage(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userMessage = body.userRequest.utterance;
        const userId = body.userRequest.user.id;

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        if (!userSessions[userId]) {
            userSessions[userId] = [];
        }

        // 이전 대화 내역 조회
        const chatHistory = userSessions[userId].join("\n");

        // 세션에 사용자 메시지 저장
        userSessions[userId].push(userMessage);

        // 대화 기능 (ChatGPT 응답)
        const gptResponse = await this.chatService.chatWithGPT(chatHistory, userMessage);
        userSessions[userId].push(gptResponse);

        // 카카오톡 응답 JSON 형식 변환
        return this.formatKakaoResponse(gptResponse);
    }

    // 채팅 바탕 글 생성 API
    @ApiBody({ type: SkillPayloadDto })
    @Post('create-article')
    async createArticle(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userId = body.userRequest.user.id;

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        if (!userSessions[userId]) {
            userSessions[userId] = [];
        }

        // 이전 대화 내역 조회
        const chatHistory = userSessions[userId].join("\n");

        // 글 생성
        const article = await this.chatService.createArticle(chatHistory);

        // 카카오톡 응답 JSON 형식 변환
        return this.formatKakaoResponse(article);

    }

    //  todo 서비스 로직으로 분리
    @ApiBody({ type: SkillPayloadDto })
    @Post('create-article/callback')
    async createArticleCallback(@Body() body: SkillPayloadDto): Promise<KakaoCallbackResponseDto> {
        const userId = body.userRequest.user.id;
        const callbackUrl = body.userRequest.callbackUrl;
        console.log('[DEBUG] callbackUrl:', callbackUrl);

        // 1차 응답: 콜백 대기 메시지 (5초 안에 응답)
        // 비동기로 콜백 전송 (내부 로직은 현재 함수 실행이 끝난 뒤 실행)
        setTimeout(async () => {
            console.log('콜백 전송 시작 -> setTimeout 내부 진입');
            try {
                if (!callbackUrl) {
                    console.warn('⚠️ callbackUrl이 없어 콜백 전송을 생략합니다.');
                    return;
                }

                // 세션 초기화
                if (!userSessions[userId]) {
                    userSessions[userId] = [];
                }

                const chatHistory = userSessions[userId].join('\n');

                // 글 생성
                const article = await this.chatService.createArticle(chatHistory);
                console.log('[DEBUG] 생성된 글:', article);

                // 카카오 말풍선 형식에 맞춘 응답
                const finalResponse = this.formatKakaoResponse(article)

                // 콜백 POST (반드시 toPromise 또는 firstValueFrom 필요)
                this.httpService.post(callbackUrl, finalResponse);
            } catch (err) {
                console.error('콜백 전송 실패:', err);
            }
        }, 0); // 즉시 비동기 실행

        return this.formatKakaoCallbackResponse(
            '하다가 글을 생성하고 있어요!\n잠시만 기다려 주시면 멋진 글을 만들어 드릴게요!',
        );
    }


    // 채팅 끝내기 (이전 채팅 내역 삭제) todo 일단 POST로 구현
    @ApiBody({ type: SkillPayloadDto })
    @Post('delete-chat')
    async deleteChat(@Body() body: SkillPayloadDto): Promise<KakaoResponseDto> {
        const userId = body.userRequest.user.id;

        // 사용자별 세션 저장소에 사용자 ID가 없으면 새로운 세션을 생성
        if (!userSessions[userId]) {
            userSessions[userId] = [];
        }

        // 이전 대화 내역 삭제
        delete userSessions[userId];

        // 카카오톡 응답 JSON 형식 변환 todo : 안내 메시지 바꾸기
        return this.formatKakaoResponse("하다와 대화가 종료되었어요! 다시 대화를 시작하려면 \"하다야\"와 함께 메시지를 입력해주세요.");
    }


    // 카카오톡 응답 JSON 형식 변환
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
