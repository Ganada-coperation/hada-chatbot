import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class UserSessionService {
    private redis: Redis;

    constructor(private readonly configService: ConfigService) {
        const host = this.configService.get<string>('REDIS_HOST');
        const port = this.configService.get<number>('REDIS_PORT');

        this.redis = new Redis({ host, port });
    }

    async getHistory(userId: string): Promise<string[]> {
        return this.redis.lrange(userId, 0, -1);
    }

    async append(userId: string, message: string) {
        await this.redis.rpush(userId, message);
    }

    async clear(userId: string) {
        await this.redis.del(userId);
    }

    async ensure(userId: string) {
        const exists = await this.redis.exists(userId);
        if (!exists) {
            await this.redis.rpush(userId, '');
            await this.redis.lpop(userId);
        }
    }
}
