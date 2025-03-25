import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.schema';

@Controller('posts') // 👉 `/posts` 경로로 API 요청을 받음
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ✅ 글 저장 API (POST /posts)
  @Post()
  async savePost(
    @Body('nickname') nickname: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<{ message: string; post: PostModel }> {
    const savedPost = await this.postService.savePost(nickname, title, content);
    return { message: "Post saved successfully", post: savedPost };
  }

  // ✅ 글 목록 조회 API (GET /posts)
  @Get()
  async getPosts(): Promise<PostModel[]> {
    return this.postService.getPosts();
  }
}
