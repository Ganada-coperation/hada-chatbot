import { ConfigService } from '@nestjs/config';

export const bullConfig = (configService: ConfigService) => ({
    redis: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        // password: configService.get<string>('REDIS_PASSWORD'), // 필요시
    },
});
