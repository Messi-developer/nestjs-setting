import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
    PortalOldIntApiService,
    portalOldIntApiUrl,
} from '@src/common/api/portal-old-int-api/portal-old-int-api.service';
import { MemberAlarmRepository } from '@src/member/repositories/member-alarm.repository';

@Processor('aipartner-message-queue', { concurrency: 10 })
export class QueueProcessorService extends WorkerHost {
    public constructor(
        private readonly portalOldIntApiService: PortalOldIntApiService,
        private readonly memberAlarmRepository: MemberAlarmRepository,
    ) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case `member-alarm-send-message`: // 이실장 알림톡 발송
                await this.memberAlarmSendMessage(job);
                break;
            case `alim-talk-send-message`: // 알림톡 발송
                await this.alimTalkSendMessage(job);
                break;
            case `alim-talk-send-button-message`: // 알림톡 발송 (버튼형)
                await this.alimTalkSendButtonMessage(job);
                break;
            default:
                return;
        }
    }

    private async memberAlarmSendMessage(job: Job) {
        const alarmSeq = await this.memberAlarmRepository.getNextSequenceV2({ seqName: 'MEMBER_ALARM_SEQ' });

        await this.memberAlarmRepository.insert({
            alarmSeq,
            agencyCd: +job.data.agencyCode,
            memberCd: +job.data.memberCode,
            alarmGbn: job.data.alarmGbn,
            content: job.data.content,
            sendStatusGbn: 'W',
        });
    }

    private async alimTalkSendMessage(job: Job) {
        await this.portalOldIntApiService.intApiRequest({
            url: portalOldIntApiUrl.message.sendMessage,
            method: 'post',
            data: {
                recipientNum: job.data.recipientNum.replaceAll(/\D/g, ''),
                subject: job.data.subject,
                contents: job.data.contents,
                templateCode: job.data.templateCode,
            },
        });
    }

    private async alimTalkSendButtonMessage(job: Job) {
        await this.portalOldIntApiService.intApiRequest({
            url: portalOldIntApiUrl.message.sendButtonMessage,
            method: 'post',
            data: {
                recipientNum: job.data.recipientNum.replaceAll(/\D/g, ''),
                subject: job.data.subject,
                contents: job.data.contents,
                templateCode: job.data.templateCode,
                buttonName: job.data.buttonName,
                buttonUrl: job.data.buttonUrl,
            },
        });
    }
}
