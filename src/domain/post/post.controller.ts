import { Controller, Post, Body, Get, NotFoundException, Param } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostIdResponse } from "./dto/response/post.id.response";
import { PostListResponse, PostResponse } from "./dto/response/post.list.response";
import { CreatePostRequest } from "./dto/request/create.post.request";
import { PostMapper } from "./post.mapper";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { MailService } from "../../infrastructure/mail/mail.service";
import { SendPostMailDto } from "./dto/request/send-post-mail.dto";
import { PostMailLogService } from "./service/post-mail-log.service";
import { v4 as uuidv4 } from 'uuid';


@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly mailService: MailService,
    private readonly postMailLogService: PostMailLogService
  ) {}

  // 글 저장 API (POST /posts)
  @Post()
@ApiBody({ type: CreatePostRequest })
@ApiResponse({ status: 201, type: PostIdResponse })
async savePost(@Body() createPostDto: CreatePostRequest): Promise<PostIdResponse> {
  const postId = createPostDto.postId ?? uuidv4(); // ❗postId가 있으면 그걸 사용
  const savedPost = await this.postService.savePost({ ...createPostDto, postId });
  return PostMapper.toPostIdResponse(savedPost);
}


  // 글 목록 조회 API (GET /posts)
  @Get()
  @ApiResponse({ status: 200, type: PostListResponse })
  async getPosts(): Promise<PostListResponse> {
    return PostMapper.toPostListResponse(await this.postService.getPosts());
  }

  // 글 상세 조회 API (GET /posts/:id)
  @Get(':id')
  @ApiResponse({ status: 200, type: PostResponse })
  async getPost(@Param('id') postId: string): Promise<PostResponse> {
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return PostMapper.toPostResponse(post);
  }

  // 글을 이메일로 전송 (POST /posts/send-mail)
  @Post('send-mail')
  async sendPostMail(@Body() body: SendPostMailDto) {
    const post = await this.postService.getPostById(body.postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.mailService.sendPostMail(body.email, post.title, post.nickname, post.content);
    await this.postMailLogService.logMailSend(body.email, post.postId);

    return { message: '메일이 성공적으로 발송되었습니다!' };
  }
}
