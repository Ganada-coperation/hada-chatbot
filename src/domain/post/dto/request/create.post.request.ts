import { IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostRequest {
    @IsString()
    @ApiProperty()
    nickname: string;

    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    content: string;
}
