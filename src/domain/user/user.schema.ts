import { Schema } from 'mongoose';
import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {BaseSchema} from "../../common/base/base.schema";

export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
