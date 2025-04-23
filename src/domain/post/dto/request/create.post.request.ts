// src/domain/post/dto/request/create.post.request.ts
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  postId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  mood?: string;
}
