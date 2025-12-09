import { Injectable } from '@nestjs/common'
import { DatabaseConnectionService } from '../../common/services/database-connection.service'
import CommonRepository from '../../common/common.repository'
import { AptIActionLogEntity } from '../entities/apt-i-action-log.entity'

@Injectable()
export class AptIActionLogRepository extends CommonRepository<AptIActionLogEntity> {
    protected table = 'TAPTI_ACTION_LOG'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(AptIActionLogEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }
}
