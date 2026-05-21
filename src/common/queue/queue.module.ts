import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { QueueProcessorService } from './queue-processor.service';
import { PortalOldIntApiService } from '@src/common/api/portal-old-int-api/portal-old-int-api.service';
// Repositories
import { MemberAlarmRepository } from '@src/member/repositories/member-alarm.repository';

const providers = [
    QueueService,
    QueueProcessorService,
    PortalOldIntApiService,
    // Repositories
    MemberAlarmRepository,
];

export const queues = {
    messageQueue: 'aipartner-message-queue',
};

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    connection: {
                        host: configService.get<string>('REDIS_HOST'),
                        port: configService.get<number>('REDIS_PORT'),
                    },
                };
            },
        }),
        BullModule.registerQueue({
            name: queues.messageQueue,
            defaultJobOptions: {
                removeOnComplete: true, // 작업 성공시 삭제
                removeOnFail: { age: 86400 }, // 실패 작업은 24시간 뒤 자동 삭제
            },
        }),
    ],
    providers: [...providers],
    exports: [BullModule, QueueService, QueueProcessorService],
})
export class QueueModule {}
