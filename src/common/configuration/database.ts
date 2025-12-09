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
            // TypeOrmModule.forRootAsync({
            //     imports: [ConfigModule],
            //     inject: [ConfigService],
            //     name: 'integratedPrimary',
            //     useFactory: async (configService: ConfigService) => {
            //         return {
            //             type: 'mysql',
            //             host: configService.get<string>('INTEGRATED_DB_HOST') || process.env.INTEGRATED_DB_HOST,
            //             port: +configService.get<number>('INTEGRATED_DB_PORT') || +process.env.INTEGRATED_DB_PORT,
            //             username: configService.get<string>('INTEGRATED_DB_USER') || process.env.INTEGRATED_DB_USER,
            //             password: configService.get<string>('INTEGRATED_DB_PASSWORD') || process.env.INTEGRATED_DB_PASSWORD,
            //             database: 'dbMember',
            //             schema: 'dbMember',
            //             entities: ['dist/**/entities/*.entity{.ts,.js}'],
            //             synchronize: false,
            //             autoLoadEntities: true,
            //             logging: ['error', 'warn', 'info', 'log'],
            //             maxQueryExecutionTime: 1000, // ms
            //             extra: {
            //                 connectionLimit: 5,
            //             },
            //         }
            //     },
            // }),
            // TypeOrmModule.forRootAsync({
            //     imports: [ConfigModule],
            //     inject: [ConfigService],
            //     name: 'plusPrimary',
            //     useFactory: async (configService: ConfigService) => {
            //         return {
            //             type: 'mysql',
            //             host: configService.get<string>('PLUS_HOST') || process.env.PLUS_HOST,
            //             port: +configService.get<number>('PLUS_PORT') || +process.env.PLUS_PORT,
            //             username: configService.get<string>('PLUS_NAME') || process.env.PLUS_NAME,
            //             password: configService.get<string>('PLUS_PASSWORD') || process.env.PLUS_PASSWORD,
            //             database: 'kms',
            //             schema: 'kms',
            //             entities: ['dist/**/entities/*.entity{.ts,.js}'],
            //             synchronize: false,
            //             autoLoadEntities: true,
            //             logging: ['error', 'warn', 'info', 'log'],
            //             maxQueryExecutionTime: 1000, // ms
            //             extra: {
            //                 connectionLimit: 5,
            //             },
            //         }
            //     },
            // }),
        ]
    }
}
