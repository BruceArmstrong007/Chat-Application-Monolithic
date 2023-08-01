import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url : configService.get<string>('REDIS_URI'),
          ttl: 5000
        }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}