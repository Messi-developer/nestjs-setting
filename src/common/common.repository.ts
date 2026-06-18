import { Inject, Injectable } from '@nestjs/common';
import { EntityTarget, Repository, DataSource, ObjectLiteral } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@src/common/services/cache/redis-cache.service';

@Injectable()
export default class CommonRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    @Inject()
    protected readonly configService: ConfigService;

    @Inject()
    protected readonly redisCacheService: RedisCacheService;

    protected connection: DataSource;

    protected cachePrefix: string;

    public constructor(
        protected entity: EntityTarget<Entity>,
        protected readonly dataSource: DataSource,
    ) {
        super(entity, dataSource.manager);

        this.connection = this.dataSource;

        let tableName = this.metadata.tableName;

        if (tableName.startsWith('TB_')) {
            tableName = tableName.substring(3); // "TB_" 제거
        } else if (tableName.startsWith('T')) {
            tableName = tableName.substring(1); // "T" 제거
        }

        this.cachePrefix =
            `portal-int-api:ai-app:` +
            tableName
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(':') +
            ':';
    }
}
