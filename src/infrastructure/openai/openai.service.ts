import {Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAIService {
    private readonly openai: OpenAI;
    private readonly logger = new Logger(OpenAIService.name); // NestJS Logger 추가

    constructor(private readonly configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async requestChatAPI(messages: ChatCompletionMessageParam[]) {
        try {

            const startTime = performance.now(); // 시작 시간 기록

            // todo : json 형식으로 제한 설정 추가하기
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0.8,
                max_tokens: 500,
                messages,
            });

            const endTime = performance.now(); // 종료 시간 기록
            const responseTime = (endTime - startTime).toFixed(2); // 밀리초 단위 응답 시간 계산

            this.logger.log(`✅ OpenAI 응답 시간: ${responseTime}ms`); // 응답 시간 로그 출력


            return response.choices[0].message?.content || '응답이 없습니다.';
        } catch (error) {
            console.error('OpenAI API 요청 실패:', error);
            throw new Error('OpenAI API 호출 중 오류가 발생했습니다.');
        }
    }
}
