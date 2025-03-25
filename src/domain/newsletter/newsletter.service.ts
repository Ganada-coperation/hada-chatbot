import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter } from './newsletter.schema';

@Injectable()
export class NewsletterService {
  constructor(
      @InjectModel(Newsletter.name)
      private readonly newsletterModel: Model<Newsletter>,
  ) {}

  async subscribe(email: string): Promise<{ success: boolean; message?: string }> {
    const exists = await this.newsletterModel.findOne({ email });
    if (exists) {
      return { success: false, message: '이미 구독된 이메일입니다.' };
    }

    await this.newsletterModel.create({ email });
    return { success: true };
  }
}
