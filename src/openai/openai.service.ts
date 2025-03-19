import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAIService {
    private readonly apiKey = process.env.OPENAI_API_KEY;
    private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

    async requestChatAPI(messages: { role: string; content: string }[]) {
        try {
            const response = await axios.post(
                this.apiUrl,
                { model: 'gpt-4', messages },
                {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API 요청 실패:', error);
            throw new Error('OpenAI API 호출 중 오류가 발생했습니다.');
        }
    }
}
