import { Injectable, Scope } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable({ scope: Scope.REQUEST })
export class DatabaseConnectionService {
    manager: any
    public constructor(
        // @InjectDataSource('integratedPrimary') private readonly integratedPrimary: DataSource,
        // @InjectDataSource('plusPrimary') private readonly plusPrimary: DataSource,
        // @InjectDataSource('plusSecondary') private readonly plusSecondary: DataSource,
        @InjectDataSource() private readonly connection: DataSource,
    ) {}

    public getDataSource(mode: string): DataSource {
        switch (mode) {
            case 'oracle':
                return this.connection
            // case 'integratedPrimary':
            //     return this.integratedPrimary
            // case 'plusPrimary':
            //     return this.plusPrimary
            // case 'plusSecondary':
            //     return this.plusSecondary
            default:
                return this.connection // oraclePrimary
        }
    }
}
