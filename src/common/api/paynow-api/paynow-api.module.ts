import { Module } from '@nestjs/common'
import { PayNowApiService } from './paynow-api.service'

@Module({
    imports: [],
    providers: [PayNowApiService],
    exports: [PayNowApiService],
})
export class PayNowApiModule {}
