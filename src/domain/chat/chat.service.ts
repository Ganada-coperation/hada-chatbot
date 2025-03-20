import {Inject, Injectable} from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import {Prompts} from "../openai/prompt";
import {ChatCompletionMessageParam} from "openai/resources/chat";

@Injectable()
export class ChatService {
    constructor(private readonly openAIService: OpenAIService,
                @Inject('PROMPTS') private readonly prompts: typeof Prompts) {}

    // 챗봇 대화 기능
    async chatWithGPT(chatHistory: string, message: string): Promise<string> {
        // todo 유저 아이디로 이전 채팅 가져오기
        // todo 이전 채팅을 기반과 현재 메시지를 합쳐 gpt에게 요청
        // 요청 예시
        /*이전 대화: 어제는 날씨가 너무추웠어요 눈도 많이 오고 근데 하루 차이로 오늘 부터는 봄이 오려나 봐요!!!
이전 대화: 바쁜 하루 였지만 잠깐잠깐 창문밖을 보면서 눈 오는 풍경을 즐겨 봤어요~
이전 대화: 어린시절 눈이 너무 많이 와서 고드름이 주렁 주렁 매달려 있어서 친구들 하고 놀았던 추억이 있어요
현재 대화: 고드름 따서 크기도 재보고 아이스크림 처럼 혀로 맛보기도 하고 썰매도 타고 끌어주기도 하고 재밌었죠ㅎㅎ
        * */

        // 프롬프트 생성
        // 시스템 메시지 + 사용자 입력 메시지로 구성
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: this.prompts.chatSystemPrompt() }, // 시스템 프롬프트
            { role: 'user', content: this.prompts.chatUserPrompt(chatHistory, message) } // 사용자 입력
        ];

        // OpenAI API 요청
        return this.openAIService.requestChatAPI(messages);
    }

    // 대화를 바탕으로 글 생성 기능
    async createArticle(chatHistory: string): Promise<string> {
        // 프롬프트 생성
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: this.prompts.articleSystemPrompt() }, // 시스템 프롬프트
            { role: 'user', content: this.prompts.articleUserPrompt(chatHistory) } // 사용자 입력
        ];


        // OpenAI API 요청
        return this.openAIService.requestChatAPI(messages);
    }
}
