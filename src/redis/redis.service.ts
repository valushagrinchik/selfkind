import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private client: Redis;

    constructor() {
        this.client = new Redis(process.env.REDIS_URL!);

        this.client.on('connect', () => {
            console.log('✅ Redis connected');
        });

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ) {
        if (ttlSeconds) {
            return this.client.set(
                key,
                value,
                'EX',
                ttlSeconds,
            );
        }

        return this.client.set(key, value);
    }

    async del(key: string) {
        return this.client.del(key);
    }
}