import { Post } from './schema/post.schema';
import { PostIdResponse } from './dto/response/post.id.response';
import {PostListResponse, PostResponse} from "./dto/response/post.list.response";

export class PostMapper {
    static toPostIdResponse(post: Post): PostIdResponse {
        return { postId: post.postId };
    }

    static toPostResponse(post: Post): PostResponse {
        return {
            nickname: post.nickname,
            title: post.title,
            content: post.content,
            postId: post.postId
        };
    }

    static toPostListResponse(posts: Post[]): PostListResponse {
        return {
            posts: posts.map(this.toPostResponse),
        };
    }

}