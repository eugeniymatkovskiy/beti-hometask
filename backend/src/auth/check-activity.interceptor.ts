import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Observable } from 'rxjs';
import {
  BLOCK_TIME_MS,
  LIMIT_OF_USER_ACTIVITY_MS,
  USER_BLOCKED_REDIS_KEY,
  USER_START_ACTIVITY_REDIS_KEY,
} from '../constants';

export class CheckActivityInterceptor implements NestInterceptor {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  private generateForbiddenException() {
    throw new ForbiddenException('The user has been blocked, try again in a few minutes');
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const { user } = context.switchToHttp().getRequest();
    const activityKey = USER_START_ACTIVITY_REDIS_KEY + user.id;
    const userIsBlockedKey = USER_BLOCKED_REDIS_KEY + user.id;

    const isUserBlocked = await this.redisClient.get(userIsBlockedKey);
    const lastActivityStart = await this.redisClient.get(activityKey);

    if (isUserBlocked) {
      this.generateForbiddenException();
    }
    if (!lastActivityStart) {
      // set TTL of key is hour and five minutes
      await this.redisClient.set(
        activityKey,
        Date.now(),
        'PX',
        LIMIT_OF_USER_ACTIVITY_MS + BLOCK_TIME_MS,
      );
    } else if (Date.now() - Number(lastActivityStart) > LIMIT_OF_USER_ACTIVITY_MS) {
      // if the user's last activity was hour and 2 minutes then we need to block him for 3 minutes      
      const ttlForBlockingUser =
        BLOCK_TIME_MS - (Date.now() - Number(lastActivityStart) - LIMIT_OF_USER_ACTIVITY_MS);
      
      await this.redisClient.del(activityKey);
      await this.redisClient.set(userIsBlockedKey, Date.now(), 'PX', ttlForBlockingUser);

      this.generateForbiddenException();
    }

    return next.handle().pipe();
  }
}
