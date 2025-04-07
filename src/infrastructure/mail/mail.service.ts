import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendPostMail(email: string, title: string, nickname: string, content: string) {

        return await this.mailerService.sendMail({
            to: email,
            subject: `[하다] "${title}" 글이 도착했어요!`,
            template: './post-mail',
            context: {
                title,
                nickname,
                content,
            },
        });
    }
}
