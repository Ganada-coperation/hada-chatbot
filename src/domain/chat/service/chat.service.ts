import {Inject, Injectable} from '@nestjs/common';
import { OpenAIService } from '../../../infrastructure/openai/openai.service';
import {Prompts} from "../../../infrastructure/openai/prompt";
import {ChatCompletionMessageParam} from "openai/resources/chat";

@Injectable()
export class ChatService {
    constructor(private readonly openAIService: OpenAIService,
                @Inject('PROMPTS') private readonly prompts: typeof Prompts) {}

    // 챗봇 대화 기능
    async chatWithGPT(chatHistory: string, message: string): Promise<string> {
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
