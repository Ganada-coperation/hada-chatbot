import {IsString, IsArray, ValidateNested, IsObject} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    type: string;

    @IsObject()
    properties: { botUserKey: string };
}

export class UserRequestDto {
    block: { id: string; name: string };
    callbackUrl?: string;

    @ValidateNested({ each: true })
    @Type(() => UserDto)
    user: UserDto;
    utterance: string;
    params: { surface: string; ignoreMe: string };
    lang: string;
    timezone: string;
}

export class IntentDto {
    id: string;
    name: string;
    extra?: {
        reason: { code: number; message: string };
        knowledge?: {
            responseType: string;
            matchedKnowledges: {
                categories: string[];
                question: string;
                answer: string;
                imageUrl?: string;
                landingUrl?: string;
            }[];
        };
    };
}

export class BotDto {
    id: string;
    name: string;
}

export class ActionDto {
    id: string;
    name: string;
    params: Record<string, any>;
    detailParams: Record<string, any>;
    clientExtra: Record<string, any>;
}

// 전체 SkillPayload DTO
export class SkillPayloadDto {
    bot: BotDto;
    intent: IntentDto;
    action: ActionDto;

    @ValidateNested()
    @Type(() => UserRequestDto)
    userRequest: UserRequestDto;

    contexts: any[];
}


// simpleText 객체 정의
class SimpleTextDto {
    @IsString()
    text: string;
}

// outputs 배열 정의
class TemplateDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SimpleTextDto)
    outputs: { simpleText: SimpleTextDto }[];
}

// 최종 대화 응답 DTO
export class KakaoResponseDto {
    @IsString()
    version: string;

    @ValidateNested()
    @Type(() => TemplateDto)
    template: TemplateDto;
}

export class Data {
    @IsString()
    text: String;
}

// 콜백 응답 DTO
export class KakaoCallbackResponseDto {
    @IsString()
    version: string;
    useCallback : boolean;

    @ValidateNested()
    @Type(() => Data)
    data : Data;
}