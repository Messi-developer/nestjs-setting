import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

export class Database {
    public static getModule() {
        return [
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => {
                    return {
                        type: 'oracle',
                        host: process.env.DB_ORACLE_HOST,
                        port: +process.env.DB_ORACLE_HOST_PORT,
                        username: process.env.DB_ORACLE_USERNAME,
                        password: process.env.DB_ORACLE_PASSWORD,
                        database: 'THEBIZ',
                        serviceName: 'THEBIZ',
                        schema: process.env.DB_ORACLE_SCHEMA,
                        entities: ['dist/**/entities/*.entity{.ts,.js}'],
                        synchronize: false,
                        autoLoadEntities: true,
                        logging: ['error', 'warn', 'info', 'log'],
                        maxQueryExecutionTime: 1000, // ms
                        extra: {
                            poolMin: 0,
                            poolMax: 10,
                            poolPingInterval: 60,
                            poolTimeout: 60,
                            queueTimeout: 10000, // ms
                        },
                    }
                },
            }),
        ]
    }
}
