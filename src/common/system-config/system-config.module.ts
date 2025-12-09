import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfigEntity } from './entities/system-config.entity'
import { ManagerMstEntity } from './entities/manager-mst.entity'
import { SystemConfigRepository } from './repositories/system-config.repository'
import { ManagerMstRepository } from './repositories/manager-mst.repository'

@Module({
    imports: [TypeOrmModule.forFeature([SystemConfigEntity, ManagerMstEntity])],
    providers: [SystemConfigRepository, ManagerMstRepository],
    exports: [TypeOrmModule, SystemConfigRepository, ManagerMstRepository]
})
export class SystemConfigModule {}
