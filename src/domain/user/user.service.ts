import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>
  ) {}

  async isNicknameAvailable(nickname: string): Promise<boolean> {
    const user = await this.userModel.findOne({ nickname });
    return !user; // true면 사용 가능
  }
}
