import { Module } from '@nestjs/common'
import { TossApiService } from './toss-api.service'

@Module({
    imports: [],
    providers: [TossApiService],
    exports: [TossApiService],
})
export class TossApiModule {}
