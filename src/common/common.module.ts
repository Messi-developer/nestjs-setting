import { Module, Global } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { Config } from '../common/configuration/config'
import { RedisCache } from '../common/cache/redis-cache'
import { RedisCacheService } from '../common/cache/redis-cache.service'
import { ResponseService } from '../common/services/response.service'
import { TeamsWebHookService } from '../common/web-hook/teams-web-hook.service'
import { PortalIntApiModule } from './api/portal-int-api/portal-int-api.module'
import { CrtptionModule } from './cryption/cryption.module'
import { LoggingService } from '../common/services/logging.service'
import { PageNationService } from '../common/services/page-nation.service'

@Global()
@Module({
    imports: [
        Config.getModule(),
        RedisCache.getModule(),
        HttpModule,
        PortalIntApiModule,
        CrtptionModule,
    ],
    providers: [
        ResponseService,
        TeamsWebHookService,
        RedisCacheService,
        LoggingService,
        PageNationService,
    ],
    exports: [ResponseService, TeamsWebHookService, RedisCacheService, LoggingService],
    controllers: []
})
export class CommonModule {}
