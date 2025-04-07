import { IsString } from 'class-validator';

export class CreatePostRequest {
    @IsString()
    nickname: string;

    @IsString()
    title: string;

    @IsString()
    content: string;
}
