import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export const CACHE_PREFIX = '';

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async get(key: string): Promise<any> {
        return await this.cacheManager.get(key);
    }

    async set(key: string, value: any, option?: any): Promise<void> {
        await this.cacheManager.set(key, value, option);
    }

    async reset(): Promise<void> {
        await this.cacheManager.clear();
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async delMultiple(keys: string[]): Promise<void> {
        if (keys.length === 0) return;

        for (const key of keys) {
            await this.cacheManager.del(key);
        }
    }

    async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
        // 1. 우선 캐시에서 조회
        const cachedData = await this.cacheManager.get<T>(key);
        if (cachedData !== undefined && cachedData !== null) {
            return cachedData;
        }

        // 2. 캐시 없으면 원본 함수(콜백) 실행
        const result = await callback();

        // 3. 결과 저장 (ttl은 초 단위 혹은 밀리초 단위인지 cache-manager 버전에 따라 확인 필요)
        await this.cacheManager.set(key, result, ttl);

        return result;
    }
}
