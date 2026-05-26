import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OnModuleDestroy } from '@nestjs/common';
import { Job } from 'bullmq';
import { LoggingService } from '@src/common/services/logging.service';
import { JobHandlerFactory } from './job-handler-factory';

@Processor('aipartner-message-queue', { concurrency: 10 })
export class QueueProcessorService extends WorkerHost implements OnModuleDestroy {
    public constructor(
        private readonly loggingService: LoggingService,
        private readonly jobHandlerFactory: JobHandlerFactory,
    ) {
        super();
    }

    async onModuleDestroy() {
        try {
            await Promise.race([
                await this.worker.close(),

                new Promise(
                    (_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000), // 30초 타임아웃
                ),
            ]);
        } catch (error) {
            await this.loggingService.log(JSON.stringify(error), `BullMQ Worker 종료 실패`);
            await this.worker.close(true); // Worker 강제종료(failed, stalled 상태로 변경되어 다음 워커에게 넘겨 재실행 처리)
        }
    }

    async process(job: Job) {
        const handler = await this.jobHandlerFactory.getInstance(job.name);

        if (!handler) {
            await this.loggingService.log(JSON.stringify(job), `지원하지 않는 작업 이름: ${job.name}`);
        }

        await handler.process(job);
    }
}
