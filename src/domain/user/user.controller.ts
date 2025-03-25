import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('nickname')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async checkNickname(@Query('nickname') nickname: string) {
    const available = await this.userService.isNicknameAvailable(nickname);
    return { available };
  }
}
