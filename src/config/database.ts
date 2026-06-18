import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class Database {
    public static getModule() {
        return [
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return {
                        type: 'mysql',
                        replication: {
                            master: {
                                host: configService.get<string>('CONTENTS_HOST'),
                                port: +configService.get<number>('CONTENTS_PORT'),
                                username: configService.get<string>('CONTENTS_NAME'),
                                password: configService.get<string>('CONTENTS_PASSWORD'),
                            },
                            slaves: [
                                {
                                    host: configService.get<string>('CONTENTS_HOST'),
                                    port: +configService.get<number>('CONTENTS_PORT'),
                                    username: configService.get<string>('CONTENTS_NAME'),
                                    password: configService.get<string>('CONTENTS_PASSWORD'),
                                },
                            ],
                        },
                        // database: 'db_content', // @Entity({ database: 'db_user' }) 선언
                        entities: ['dist/**/entities/*.entity{.ts,.js}'],
                        synchronize: false,
                        autoLoadEntities: true,
                        logging: ['error', 'warn'],
                        maxQueryExecutionTime: 1000, // ms
                        extra: {
                            connectionLimit: 5,
                            waitForConnections: true, // 풀에 자리가 없을 때 에러를 내지 않고 대기
                            supportBigNumbers: true, // 큰 숫자(BIGINT 등) 지원
                            bigNumberStrings: false, // 숫자를 문자열이 아닌 JavaScript Number로 처리
                        },
                        cache: {
                            type: 'redis',
                            options: {
                                url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
                            },
                        },
                    };
                },
            }),
        ];
    }
}
