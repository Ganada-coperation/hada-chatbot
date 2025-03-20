import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAIService {
    private readonly openai: OpenAI;

    constructor(private readonly configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async requestChatAPI(messages: ChatCompletionMessageParam[]) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages,
            });

            return response.choices[0].message?.content || '응답이 없습니다.';
        } catch (error) {
            console.error('OpenAI API 요청 실패:', error);
            throw new Error('OpenAI API 호출 중 오류가 발생했습니다.');
        }
    }
}
