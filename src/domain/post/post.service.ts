import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // ✅ 글 저장 기능
  async savePost(nickname: string, title: string, content: string): Promise<Post> {
    const newPost = new this.postModel({ nickname, title, content });
    return newPost.save();
  }

  // ✅ 글 목록 조회 기능
  async getPosts(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }
}
