import { IsString } from 'class-validator';

export class PostResponse {
    @IsString()
    nickname: string;

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    postId: string;
}

export class PostListResponse {
    @IsString({ each: true })
    posts: PostResponse[];
}