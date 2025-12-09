import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'


@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {
    }

    async get(key: string): Promise<any> {
        return await this.cacheManager.get(key)
    }

    async set(key: string, value: any, option?: any): Promise<void> {
        await this.cacheManager.set(key, value, option)
    }

    async reset(): Promise<void> {
        await this.cacheManager.clear()
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key)
    }

    async delMultiple(keys: string[]): Promise<void> {
        if (keys.length === 0) return

        for (const key of keys) {
            await this.cacheManager.del(key);
        }
    }
}
