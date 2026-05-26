import { AppContext } from '@src/common/app-context';
import { RedisCacheService } from '@src/common/cache/redis-cache.service';

export type KeyFactory = string | ((...args: any[]) => string);
export type TTLFactory = (...args: any[]) => number;

export const Cacheable = (keyOrFactory: KeyFactory, ttlOrFactory: number | TTLFactory = 1) => {
    return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const redisCacheService = AppContext.get<RedisCacheService>(RedisCacheService);
            const cacheKey = typeof keyOrFactory === 'function' ? keyOrFactory(...args) : keyOrFactory;
            const finalTtl = typeof ttlOrFactory === 'function' ? ttlOrFactory(...args) : ttlOrFactory;

            return await redisCacheService.remember(
                cacheKey,
                finalTtl * 1000,
                async () => await originalMethod.apply(this, args),
            );
        };

        return descriptor;
    };
};
