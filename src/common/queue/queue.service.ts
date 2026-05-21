import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
    public constructor(@InjectQueue('aipartner-message-queue') private readonly messageQueue: Queue) {}

    public async addQueueJob(processorName: string, jobName: string, data: any) {
        switch (processorName) {
            case 'aipartner-message-queue':
                return await this.messageQueue.add(jobName, data);
            default:
                throw new NotFoundException('Queue not found');
        }
    }

    public async getQueueJob(processorName: string, jobId: string) {
        switch (processorName) {
            case 'aipartner-message-queue':
                const job = await this.messageQueue.getJob(jobId);

                if (!job) throw new NotFoundException('Job not found');

                return job;
            default:
                throw new NotFoundException('Queue not found');
        }
    }
}
