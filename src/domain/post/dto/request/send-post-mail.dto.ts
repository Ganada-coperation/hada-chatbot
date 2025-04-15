import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPostMailDto {
    @ApiProperty({ description: '전송할 게시글의 ID' })
    @IsString()
    postId: string;

    @ApiProperty({ description: '받는 사람의 이메일 주소' })
    @IsEmail()
    email: string;
}
