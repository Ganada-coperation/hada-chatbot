import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, HydratedDocument} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {BaseSchema} from "../../common/base/base.schema";

@Schema({ timestamps: true })
export class Post extends BaseSchema {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: uuidv4, unique: true })
  postId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = Post & Document;
