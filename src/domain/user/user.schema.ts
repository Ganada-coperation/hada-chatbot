import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  nickname: { type: String, required: true, unique: true },
});
