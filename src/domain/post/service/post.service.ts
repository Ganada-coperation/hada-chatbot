// src/domain/post/service/post.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { CreatePostRequest } from '../dto/request/create.post.request';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async savePost(request: CreatePostRequest): Promise<Post> {
    const postId = request.postId ?? uuidv4();

    const updatedPost = await this.postModel.findOneAndUpdate(
      { postId },
      {
        postId,
        nickname: request.nickname,
        title: request.title,
        content: request.content,
        email: request.email ?? null,
        mood: request.mood ?? null,
      },
      {
        upsert: true,
        new: true, // 업데이트된 문서를 리턴
      }
    );

    return updatedPost;
  }

  async getPostById(postId: string): Promise<Post | null> {
    console.log("🔍 조회 시도: postId =", postId);
    const result = await this.postModel.findOne({ postId }).exec();
    console.log("🔎 조회 결과:", result);
    return result;
  }

  async getPosts(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }
}
