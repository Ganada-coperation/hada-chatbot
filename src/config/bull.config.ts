import { ConfigService } from '@nestjs/config';

export const bullConfig = (configService: ConfigService) => {
    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = configService.get<number>('REDIS_PORT');
    const redisPassword = configService.get<string>('REDIS_PASSWORD');

    console.log('Redis password in use:', redisPassword);

    return {
        redis: {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
        },
    };
};