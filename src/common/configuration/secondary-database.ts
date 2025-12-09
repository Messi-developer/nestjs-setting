import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

export class SecondaryDatabase {
    public static getModule() {
        return [
            // TypeOrmModule.forRootAsync({
            //     imports: [ConfigModule],
            //     inject: [ConfigService],
            //     name: 'plusSecondary',
            //     useFactory: async (configService: ConfigService) => {
            //         return {
            //             type: 'mysql',
            //             host: configService.get<string>('PLUS_SECONDARY_HOST') || process.env.PLUS_SECONDARY_HOST,
            //             port: +configService.get<number>('PLUS_SECONDARY_PORT') || +process.env.PLUS_SECONDARY_PORT,
            //             username: configService.get<string>('PLUS_SECONDARY_NAME') || process.env.PLUS_SECONDARY_NAME,
            //             password:
            //                 configService.get<string>('PLUS_SECONDARY_PASSWORD') || process.env.PLUS_SECONDARY_PASSWORD,
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
