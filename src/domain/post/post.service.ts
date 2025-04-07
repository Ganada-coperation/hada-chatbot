import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Post} from './post.schema';
import {CreatePostRequest} from "./dto/request/create.post.request";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // 글 저장 기능
  async savePost(request: CreatePostRequest): Promise<Post> {
    const newPost = new this.postModel(request);
    return await newPost.save();
  }

  // 글 목록 조회 기능
  async getPosts(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  // 글 상세 조회 기능
  async getPostById(postId: string): Promise<Post | null> {
    // todo: postId 유효성 검사
    return this.postModel.findOne({ postId: postId }).exec();
  }
}
