import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, HydratedDocument} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: uuidv4, unique: true })
  postId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
