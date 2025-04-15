import {Controller, Post, Body, Get, NotFoundException} from '@nestjs/common';
import { PostService } from './service/post.service';
import {PostIdResponse} from "./dto/response/post.id.response";
import {PostListResponse, PostResponse} from "./dto/response/post.list.response";
import {CreatePostRequest} from "./dto/request/create.post.request";
import {PostMapper} from "./post.mapper";
import {ApiBody, ApiResponse} from "@nestjs/swagger";
import {MailService} from "../../infrastructure/mail/mail.service";
import {SendPostMailDto} from "./dto/request/send-post-mail.dto";
import {PostMailLogService} from "./service/post-mail-log.service";

@Controller('posts') // 👉 `/posts` 경로로 API 요청을 받음
export class PostController {
  constructor(private readonly postService: PostService
              , private readonly mailService:MailService
              , private readonly postMailLogService:PostMailLogService) {}

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

    // 글 상세 조회 API (GET /posts/:id)
  @Get(':id')
  @ApiResponse({ status: 200, type: PostResponse })
  async getPost(@Body('postId') id: string): Promise<PostResponse> {

    // 글 상세 조회
    const post = await this.postService.getPostById(id);

    // 글 정보를 응답으로 반환
    if(post === null) {
        throw new Error('Post not found');
    }
    return PostMapper.toPostResponse(post);
  }

  // 내 글 받아보기
  // 글 아이디와 이메일을 요청으로 받음
  // 아이디를 가지고 글을 찾임
  // 글 정보로 제목, 닉네임, 내용을 가져와서 이쁘게 가공함
  // 그걸 이메일로 전송함
  // 성공 리턴
// todo : DTO로 감싸기
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
