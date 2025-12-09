import { Module } from '@nestjs/common'
import { PortalPropertyApiService } from './portal-property-api.service'

@Module({
    imports: [],
    providers: [PortalPropertyApiService],
    exports: [PortalPropertyApiService],
})
export class PortalPropertyApiModule {}
