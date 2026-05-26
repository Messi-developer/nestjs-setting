import { Exclude, Transform } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import * as dayjs from 'dayjs';

export enum EStatusGbn {
    PAY_REQUEST = 'PR',
    PAY_WAIT = 'PW', // 단말기 결제 대기
    PAY_WAIT_CANCEL = 'PWC', // 단말기 결제 대기 취소
    PAY_DEPOSIT_WAITING = 'PDW', //가상계좌 입금대기
    PAY_DEPOSIT_CANCEL = 'PDC', //가상계좌 입금 취소
    PAY_COMPLETE = 'PC',
    PAY_FAIL = 'PF',
    REFUND_REQUEST = 'RR',
    REFUND_COMPLETE_ALL = 'RCA', // 환불 완료 (전액)
    REFUND_COMPLETE_PARTIAL = 'RCP', // 환불 완료 (부분)
    REFUND_FAIL = 'RF', // 환불실패
    REFUND_WAIT_ALL = 'RWA', // 환불 대기 (전액)
    REFUND_WAIT_PARTIAL = 'RWP', // 환불대기 (부분)
    CONNECT_WAIT = 'CW', // CP사 연동 세팅 대기
}

export enum EStatusGbnType {
    PAID = 'paid',
    PAY_WAIT = 'pay_wait',
    CONNECT_WAIT = 'connect_wait',
}

export enum EContentsKey {
    ADD_COMPLEX_CD_LIST = 'addComplexCdList',
}

export enum EMngConfirmGbn {
    WAIT = 'S', // 승인대기
    COMPLETE = 'C', // 승인완료
}

export type TContents = {
    areaCd?: string;
    complexCdList?: number[];
    addComplexCdList?: number[];
    cpCd?: string;
    tid?: string;
    billKey?: string;
};

@Entity('TB_ORDER_MST')
export class OrderMstEntity {
    @PrimaryColumn('number', {
        name: 'ORDER_SEQ',
    })
    orderSeq: number;

    @Column('number', {
        name: 'AGENCY_CD',
    })
    agencyCd: number;

    @Column('number', {
        name: 'MEMBER_CD',
    })
    memberCd: number;

    @Column('number', {
        name: 'PAY_METHOD_NO',
    })
    payMethodNo: number;

    @Column('number', {
        name: 'GOODS_CD',
    })
    goodsCd: number;

    @Column('varchar2', {
        name: 'USE_START_YMD',
    })
    useStartYmd: string;

    @Column('varchar2', {
        name: 'USE_END_YMD',
    })
    useEndYmd: string;

    @Column('number', {
        name: 'GOODS_PRC',
    })
    goodsPrc: number;

    @Column('number', {
        name: 'DISCOUNT_PRC',
    })
    discountPrc?: number = 0;

    @Column('number', {
        name: 'PAY_PRC',
    })
    payPrc?: number;

    @Column('timestamp', {
        name: 'PAY_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    payDate: Date;

    @Column('number', {
        name: 'REFUND_PRC',
    })
    refundPrc?: number;

    @Column('timestamp', {
        name: 'REFUND_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    refundDate?: Date;

    @Column('varchar2', {
        name: 'PAYMENT_KEY',
    })
    paymentKey: string;

    @Column('varchar2', {
        name: 'RECEIPT_URL',
    })
    receiptUrl: string;

    @Column('varchar2', {
        name: 'STATUS_GBN',
    })
    statusGbn: EStatusGbn;

    @Column('timestamp', {
        name: 'REG_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    regDate: Date;

    @Column('timestamp', {
        name: 'MOD_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    modDate?: Date;

    @Column('number', {
        name: 'PAY_SETUP_SEQ',
    })
    paySetupSeq: number;

    @Column('number', {
        name: 'ADD_COMPLEX_CNT',
    })
    addComplexCnt: number;

    @Column('number', {
        name: 'ADD_MEMBER_CNT',
    })
    addMemberCnt: number;

    @Column('simple-json', {
        name: 'CONTENTS',
    })
    contents: TContents;

    @Column('number', {
        name: 'REFUND_REQ_SEQ',
    })
    refundReqSeq?: number;

    @Column('number', {
        name: 'P_ORDER_SEQ',
    })
    parentOrderSeq?: number;

    @Column('varchar2', {
        name: 'MEMO',
    })
    memo?: string;

    @Column('varchar2', {
        name: 'APPROVE_NO',
    })
    approveNo: string;

    @Column('varchar2', {
        name: 'MNG_CONFIRM_GBN',
    })
    mngConfirmGbn?: EMngConfirmGbn;

    @Column('number', {
        name: 'INSTALLMENT_CNT',
    })
    installmentCnt: number;

    @Column('number', {
        name: 'DISCOUNT_SEQ',
    })
    discountSeq?: number;

    @Column('varchar2', {
        name: 'ORDER_NO',
    })
    orderNo: string;

    @Exclude()
    @Column('timestamp', {
        name: 'DEL_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    delDate?: Date;

    @Column('number', {
        name: 'N_MEMBERSHIP_STATE',
    })
    nMembershipState?: number;
}
