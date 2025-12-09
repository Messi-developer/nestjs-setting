import { Module } from '@nestjs/common'
import { PortalIntApiService } from './portal-int-api.service'

@Module({
    imports: [],
    providers: [PortalIntApiService],
    exports: [PortalIntApiService],
})
export class PortalIntApiModule {}
