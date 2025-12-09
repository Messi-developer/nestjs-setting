import { Injectable } from '@nestjs/common'
import { DatabaseConnectionService } from '../../../common/services/database-connection.service'
import CommonRepository from '../../../common/common.repository'
import { ManagerMstEntity } from '../entities/manager-mst.entity'

@Injectable()
export class ManagerMstRepository extends CommonRepository<ManagerMstEntity> {
    protected table = 'TB_MANAGER_MST'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(ManagerMstEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }

    public async getManagerInfoById(params) {
        return await this.connection.manager.getRepository(ManagerMstEntity).createQueryBuilder('manager')
            .select([
                'manager.MANAGER_ID as "managerId"',
                'manager.MANAGER_NM as "managerNm"',
                'manager.HP as "hp"',
                'manager.DEPT_NM as "deptName"',
                'manager.GRADE_GBN as "gradeGbn"',
            ])
            .where('manager.MANAGER_ID = :managerId', { managerId: params.managerId })
            .andWhere('manager.STATUS_GBN = :statusGbn', { statusGbn: 'VALID' }) // VALID : 정상, RETIRE : 퇴사
            .getRawOne()
    }
}