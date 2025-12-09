import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis'

export class RedisCache {
    public static getModule() {
        return CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
                return {
                    stores: [
                        new KeyvRedis(redisUrl) // Redis URL을 KeyvRedis에 전달
                    ],
                };
            },
        });
    }
}