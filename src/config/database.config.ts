import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService) => {
    const dbHost = configService.get<string>('DB_HOST');
    return {
        uri: dbHost,
    };
};
