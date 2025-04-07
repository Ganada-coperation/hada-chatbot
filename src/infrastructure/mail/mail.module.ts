import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule, // ✅ ConfigModule 추가!
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    service: 'gmail',
                    auth: {
                        user: configService.get<string>('MAIL_USER'),
                        pass: configService.get<string>('MAIL_PASS'),
                    },
                },
                defaults: {
                    from: '"Hada 서비스" <no-reply@hada.com>',
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService], // ✅ 다른 모듈에서 사용할 수 있도록 export
})
export class MailModule {}
