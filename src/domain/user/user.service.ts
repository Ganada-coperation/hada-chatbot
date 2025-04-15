import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User, UserDocument} from "./user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>
  ) {}

  async isNicknameAvailable(nickname: string): Promise<boolean> {
    const user = await this.userModel.findOne({ nickname });
    return !user; // true면 사용 가능
  }

  //카카오 유저 ID로 유저 조회
  async findByKakaoUserId(kakaoUserId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ kakaoUserId });
  }

  //유저 생성 (중복 확인 안 함 — 외부에서 검증 필요)
  async createUser(nickname: string, kakaoUserId: string): Promise<UserDocument> {
    const newUser = new this.userModel({ nickname, kakaoUserId });
    return newUser.save();
  }

  // 카카오 유저 ID로 조회하거나 없으면 생성
  async findOrCreateByKakaoUserId(kakaoUserId: string): Promise<UserDocument> {
    let user = await this.findByKakaoUserId(kakaoUserId);

    // 유저가 없으면 생성
    if (!user) {
      const defaultNickname = `사용자_${kakaoUserId.slice(-4)}`;
      user = await this.createUser(defaultNickname, kakaoUserId);
    }
    return user;
  }
}
