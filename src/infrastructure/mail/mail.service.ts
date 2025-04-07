import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendPostMail(email: string, title: string, nickname: string, content: string) {
        // todo : html 템플릿으로 변경(이쁜 템플릿 만들어서 보내기)
        const html = `
      <h2>${title}</h2>
      <p><strong>작성자:</strong> ${nickname}</p>
      <p>${content}</p>
    `;

        return await this.mailerService.sendMail({
            to: email,
            subject: `[하다] "${title}" 글이 도착했어요!`,
            html,
        });
    }
}
