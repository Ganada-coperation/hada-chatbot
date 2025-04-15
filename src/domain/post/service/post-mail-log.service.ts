import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {SentPostMail, SentPostMailDocument} from "../schema/post-mail-log.schema";

@Injectable()
export class PostMailLogService {
    constructor(
        @InjectModel(SentPostMail.name)
        private readonly model: Model<SentPostMailDocument>,
    ) {}

    async logMailSend(email: string, postId: string) {
        await this.model.create({ email, postId });
    }
}