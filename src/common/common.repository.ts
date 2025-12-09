import { Injectable, Scope } from '@nestjs/common'
import { EntityTarget, InsertResult, Repository, DataSource } from 'typeorm'
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { DatabaseConnectionService } from '../common/services/database-connection.service'
import * as mysql from 'mysql2/promise'

@Injectable({ scope: Scope.REQUEST })
export default class CommonRepository<Entity> {
    protected databaseConnectionService: DatabaseConnectionService

    protected dataSource: DataSource

    protected connection: DataSource
    protected integratedPrimary: DataSource
    protected plusPrimary: DataSource
    protected plusSecondary: DataSource
   

    public constructor(protected entity: EntityTarget<Entity>, databaseConnectionService: DatabaseConnectionService) {
        this.databaseConnectionService = databaseConnectionService

        this.connection = this.databaseConnectionService.getDataSource('')
        this.integratedPrimary = this.databaseConnectionService.getDataSource('integratedPrimary')
        this.plusPrimary = this.databaseConnectionService.getDataSource('plusPrimary')
        this.plusSecondary = this.databaseConnectionService.getDataSource('plusSecondary')
    }

    public async insertData(type: string, entity: EntityTarget<Entity>, data): Promise<InsertResult> {
        const connection = this.databaseConnectionService.getDataSource(type)
        return await connection.createQueryBuilder().insert().into(entity).values(data).execute()
    }

    public async createData(entity: EntityTarget<Entity>, data) {
        return this.dataSource.manager.getRepository(entity).create(data)
    }

    public async saveData(entity: EntityTarget<Entity>, data) {
        return await this.dataSource.manager.getRepository(entity).save(data)
    }

    public async updateData(
        type: string,
        entity: EntityTarget<Entity>,
        set: object,
        where: object,
    ): Promise<UpdateResult> {
        const connection = this.databaseConnectionService.getDataSource(type)
        let queryBuilder = connection.getRepository(entity).createQueryBuilder().update(entity).set(set)
        queryBuilder = this.addWhere(queryBuilder, where)

        return await queryBuilder.execute()
    }

    public async deleteData(type: string, entity: EntityTarget<Entity>, where): Promise<DeleteResult> {
        const connection = this.databaseConnectionService.getDataSource(type)
        let queryBuilder = connection.getRepository(entity).createQueryBuilder().delete().from(entity)
        queryBuilder = this.addWhere(queryBuilder, where)

        return await queryBuilder.execute()
    }

    /**
     * query builder로 where문 만들기
     * @param queryBuilder
     * @param where
     * @private
     */
    protected addWhere(queryBuilder, where: object) {
        const bind: object = {}
        let query = ''
        let key = 0

        for (const property in where) {
            bind[property] = where[property]
            query = `${property} = :${property}`

            if (key < 1) {
                queryBuilder.where(query, bind)
            } else {
                queryBuilder.andWhere(query, bind)
            }

            key++
        }

        return queryBuilder
    }

    protected getCompiledQuery(query: string, bindings): string {
        let pos: number, toBeBind, bindType: string

        for (const index in bindings) {
            pos = query.indexOf('?') + 1

            bindType = typeof bindings[index]

            if (bindType === 'number') {
                toBeBind = bindings[index]
            } else if (bindType === 'object') {
                toBeBind = `'` + bindings[index].join("', '") + `'`
            } else {
                toBeBind = `'${bindings[index]}'`
            }

            query = query.substring(0, pos).replace(/\?/, toBeBind) + '' + query.substring(pos)
        }

        return query
    }

    public async getNextSequence(params: { type: string; seqName: string; schema: string }) {
        const query = `SELECT ${params.schema}.${params.seqName}.NEXTVAL FROM DUAL`
        const connection = this.databaseConnectionService.getDataSource(params.type)
        return await connection.manager.query(query, []).then((rows) => rows[0].NEXTVAL)
    }

    public async queryBindings(sql: string, bindings: any): Promise<string> {
        return sql.replace(/:(\w+)/g, (txt, key) => {
            if (bindings.hasOwnProperty(key)) {
                return mysql.escape(bindings[key])
            }
            return txt
        })
    }
}
