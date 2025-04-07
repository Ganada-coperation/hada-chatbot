import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: '"Hada 서비스" <no-reply@hada.com>',
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService], // ✅ 다른 모듈에서 사용할 수 있도록 export
})
export class MailModule {}
