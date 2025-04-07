import {IsString} from "class-validator";

export class PostIdResponse {
    @IsString()
    postId: string;
}