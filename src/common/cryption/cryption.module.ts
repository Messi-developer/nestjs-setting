import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConnectionService } from '../services/database-connection.service'
import { CommonCryptionService } from './cryption.service'
import { BillingCryptionService } from './billing-cryption.service'
import { SystemConfigEntity } from '../system-config/entities/system-config.entity'
import { SystemConfigRepository } from '../system-config/repositories/system-config.repository'

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([SystemConfigEntity])],
    providers: [DatabaseConnectionService, CommonCryptionService, BillingCryptionService, SystemConfigRepository],
    exports: [CommonCryptionService, BillingCryptionService]
})
export class CrtptionModule {}
