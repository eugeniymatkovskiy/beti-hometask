import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async getValue(key: string) {
    return await this.redisClient.get(key);
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
