import { Injectable } from '@nestjs/common'
import { SystemConfigEntity } from '../entities/system-config.entity'
import { DatabaseConnectionService } from '../../services/database-connection.service'
import CommonRepository from '../../../common/common.repository'

@Injectable()
export class SystemConfigRepository extends CommonRepository<SystemConfigEntity> {
    protected table = 'TB_SYSTEM_CONFIG'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(SystemConfigEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }

    public async getKindByData(params) {
        return await this.connection.manager.getRepository(SystemConfigEntity).createQueryBuilder('systemConfig')
            .select([
                'KIND',
                'DATA_JSON'
            ])
            .where('KIND = :KIND', { KIND: params.kind })
            .getRawOne()
    }
}
