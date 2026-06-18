import { Job } from 'bullmq';

export const jobNames = {
    MEMBER_ALARM_SEND_MESSAGE: 'member-alarm-send-message',
    ALIM_TALK_SEND_MESSAGE: 'alim-talk-send-message',
    ALIM_TALK_SEND_BUTTON_MESSAGE: 'alim-talk-send-button-message',
} as const;

export type JobName = (typeof jobNames)[keyof typeof jobNames];

export interface JobHandler {
    process(job: Job): Promise<void>;
}
