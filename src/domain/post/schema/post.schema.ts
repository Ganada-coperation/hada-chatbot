// src/domain/post/schema/post.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../../../common/base/base.schema';

@Schema({ timestamps: true })
export class Post extends BaseSchema {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, unique: true })
  postId: string;

  // ✅ 이메일은 선택적으로 저장 가능
  @Prop()
  email?: string;

  // ✅ 기분도 선택적으로 저장 가능
  @Prop()
  mood?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = Post & Document;
