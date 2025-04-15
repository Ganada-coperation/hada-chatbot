import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {BaseSchema} from "../../common/base/base.schema";

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, unique: true })
  kakaoUserId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
