import { Injectable } from '@nestjs/common';
import { JobHandler, jobNames } from './job-handler.interface';
import { MemberAlarmHandler } from './services/member-alarm-handler';
import { AlimTalkSendMessageHandler } from './services/alim-talk-send-message-handler';

@Injectable()
export class JobHandlerFactory {
    private readonly handlers: Map<string, JobHandler>;

    public constructor(
        private readonly memberAlarmHandler: MemberAlarmHandler,
        private readonly alimTalkSendMessageHandler: AlimTalkSendMessageHandler,
    ) {
        this.handlers = new Map<string, JobHandler>([
            [jobNames.MEMBER_ALARM_SEND_MESSAGE, this.memberAlarmHandler],
            [jobNames.ALIM_TALK_SEND_MESSAGE, this.alimTalkSendMessageHandler],
        ]);
    }

    public async getInstance(jobName: string) {
        return this.handlers.get(jobName);
    }
}
