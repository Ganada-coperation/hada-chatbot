import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ChatSession, ChatSessionDocument} from "./schema/chat.session.schema";
import {ChatMessage, ChatMessageDocument} from "./schema/chat.message.schema";
import {SenderType} from "./schema/chat.enum";
import {User, UserDocument} from "../user/user.schema";

@Injectable()
export class ChatDataService {
    constructor(
        @InjectModel(ChatSession.name)
        private readonly chatSessionModel: Model<ChatSessionDocument>,

        @InjectModel(ChatMessage.name)
        private readonly chatMessageModel: Model<ChatMessageDocument>
    ) {}

    // 사용자의 활성 채팅 세션 조회 또는 생성
    async getOrCreateActiveSession(kakaoUserId: string): Promise<ChatSessionDocument> {

        // 사용자 ID로 활성 세션 조회
        let session = await this.chatSessionModel.findOne({ kakaoUserId: kakaoUserId, isFinished: false });

        // 활성 세션이 없으면 새로 생성
        if (!session) {
            session = await this.chatSessionModel.create({
                kakaoUserId: kakaoUserId,
                isFinished: false,
            });
        }

        return session;
    }

    //채팅 메시지 추가
    async addMessage(kakaoUserId: string, sender: SenderType, message: string): Promise<ChatMessageDocument> {
        // 사용자 ID로 활성 세션 조회
        const session = await this.getOrCreateActiveSession(kakaoUserId);

        return this.chatMessageModel.create({
            session: session._id ,
            sender,
            message,
        });
    }

    //세션별 전체 채팅 내역 조회 (시간 순)
    async getOnlyUserMessages(kakaoUserId: string): Promise<ChatMessageDocument[]> {
        // 사용자 ID로 활성 세션 조회
        const session = await this.getOrCreateActiveSession(kakaoUserId);

        return this.chatMessageModel
            .find({ session: session._id , sender: SenderType.USER }) // 사용자 메시지만 조회
            .sort({ createdAt: 1 })
            .exec();
    }

    //세션 종료 처리 (글 생성 완료 등)
    async finishSession(kakaoUserId: string): Promise<void> {
        await this.chatSessionModel.findOneAndUpdate(
            { kakaoUserId, isFinished: false }, // 🔍 현재 진행 중인 세션만 종료
            {
                isFinished: true,
                finishedAt: new Date(),
            },
        );

    }
}
