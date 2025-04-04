import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostService } from './post.service';
import {PostIdResponse} from "./dto/response/post.id.response";
import {PostListResponse} from "./dto/response/post.list.response";
import {CreatePostRequest} from "./dto/request/create.post.request";
import {PostMapper} from "./post.mapper";
import {ApiBody, ApiResponse} from "@nestjs/swagger";

@Controller('posts') // 👉 `/posts` 경로로 API 요청을 받음
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 글 저장 API (POST /posts)
  @Post()
  @ApiBody({ type: CreatePostRequest })
  @ApiResponse({ status: 201, type: PostIdResponse })
  async savePost(@Body() createPostDto: CreatePostRequest): Promise<PostIdResponse>
  {
    // 글 저장
    const savedPost = await this.postService.savePost(createPostDto);

    // 저장된 글의 ID를 응답으로 반환
    return PostMapper.toPostIdResponse(savedPost);
  }

  // 글 목록 조회 API (GET /posts)
  @Get()
  @ApiResponse({ status: 201, type: PostListResponse })
  async getPosts(): Promise<PostListResponse> {

    return PostMapper.toPostListResponse(await this.postService.getPosts());
  }
}
