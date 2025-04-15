import {GeneratedContent, GeneratedContentDocument} from "../schema/generated.content.schema";
import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {ChatService} from "./chat.service";
import {Model} from "mongoose";

@Injectable()
export class GeneratedContentService {
    private readonly logger = new Logger(GeneratedContentService.name);

    constructor(
        private readonly chatService: ChatService,
        @InjectModel(GeneratedContent.name)
        private readonly generatedContentModel: Model<GeneratedContentDocument>,
    ) {}

    /**
     * GPT 글 생성 및 저장
     * @param chatHistory 참여자의 대화 내용
     * @param kakaoUserId 카카오 유저 ID
     */
    async generateContent(chatHistory: string, kakaoUserId: string): Promise<GeneratedContentDocument> {
        try {
            // GPT 글 생성 호출
            const gptResponse = await this.chatService.createArticle(chatHistory);

            // JSON 파싱 시도
            const parsed = this.parseJsonSafely(gptResponse);

            // 검증
            if (!parsed?.title || !parsed?.content) {
                throw new Error('GPT 응답에 title 또는 content 없음');
            }

            // 저장
            const newContent = new this.generatedContentModel({
                title: parsed.title,
                content: parsed.content,
                kakaoUserId,
            });

            return await newContent.save();
        } catch (err) {
            this.logger.error('글 생성 실패', err);
            throw err;
        }
    }

    /**
     * GPT 응답에서 JSON 안전하게 파싱
     */
    private parseJsonSafely(raw: string): { title: string; content: string } | null {
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return null;
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            this.logger.error('GPT 응답 JSON 파싱 실패', e);
            return null;
        }
    }
}