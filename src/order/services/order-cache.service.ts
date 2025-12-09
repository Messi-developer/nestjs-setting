import { Injectable } from '@nestjs/common'
import { RedisCacheService } from '../../common/cache/redis-cache.service'
import { PortalIntApiService } from '../../common/api/portal-int-api/portal-int-api.service'

export type ResponseCacheData = {
    useAble: boolean
    data: null
}

@Injectable()
export class OrderCacheService {
    private readonly key: string

    public constructor(
        private readonly redisCacheService: RedisCacheService,
        private readonly portalIntApiService: PortalIntApiService,
    ) {
        this.key = `portal-int-api:bill:Order`
    }

    public async getCacheData(req): Promise<ResponseCacheData> {
        const cacheKey = `${this.key}:${req.cacheKey}`

        const cache = await this.redisCacheService.get(cacheKey)

        if (cache) {
            return {
                useAble: true,
                data: JSON.parse(cache),
            }
        }

        return {
            useAble: false,
            data: null,
        }
    }

    public async setCacheData(req): Promise<void> {
        const cacheKey = `${this.key}:${req.cacheKey}`

        await this.redisCacheService.set(cacheKey, JSON.stringify(req.data), req.extinction ? +req.extinction * 1000 : 60 * 60 * 24 * 1000)
    }

    public async delCacheData(req: { cacheKey: string }): Promise<void> {
        await this.redisCacheService.del(`${this.key}:${req.cacheKey}`)
    }

    public async deleteMemberCache(req: { memberCode: number }) {
        await this.portalIntApiService.intApiRequest({
            url: `/member/${req.memberCode}/detail/delete/cache`,
            method: 'post',
            data: {},
        })
    }
}
