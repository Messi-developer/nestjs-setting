import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { QueueProcessorService } from './queue-processor.service';
import { JobHandlerFactory } from './job-handler-factory';

const providers = [QueueService, QueueProcessorService, JobHandlerFactory];

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
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        }),
    ],
    providers: [...providers],
    exports: [QueueService, QueueProcessorService],
})
export class QueueModule {}
