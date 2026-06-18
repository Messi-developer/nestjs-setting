import { Injectable } from '@nestjs/common';
import { JobHandler, jobNames } from './services/job-handler.interface';

@Injectable()
export class JobHandlerFactory {
    private readonly handlers: Map<string, JobHandler>;

    public constructor() {
        // this.handlers = new Map<string, JobHandler>([[jobNames.MEMBER_ALARM_SEND_MESSAGE, this.memberAlarmHandler]]);
    }

    public async getInstance(jobName: string) {
        return this.handlers.get(jobName);
    }
}
