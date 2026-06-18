import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

export class RedisCache {
    public static getModule() {
        return CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisUrl = `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`;
                return {
                    stores: [
                        new KeyvRedis(redisUrl), // Redis URL을 KeyvRedis에 전달
                    ],
                };
            },
        });
    }
}
