import { Injectable } from '@nestjs/common';
import { JobHandler } from '../job-handler.interface';
import { Job } from 'bullmq';

@Injectable()
export class AlimTalkSendMessageHandler implements JobHandler {
    public constructor() {}

    async process(job: Job): Promise<void> {
        console.log(`alim talk send message handler`);
    }
}
