import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import * as dayjs from 'dayjs';

export enum ERegGbn {
    GENERAL = 'G',
    MEMBERSHIP_CHANGE = 'MC',
    MEMBERSHIP_RENEWAL = 'MR',
}

@Entity('TB_PAY_SETUP')
export class PaySetupEntity {
    @PrimaryColumn('number', {
        name: 'SETUP_SEQ',
    })
    setupSeq: number;

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

    @Column('number', {
        name: 'ADD_COMPLEX_CNT',
    })
    addComplexCnt: number;

    @Column('number', {
        name: 'ADD_MEMBER_CNT',
    })
    addMemberCnt: number;

    @Column('varchar2', {
        name: 'USE_START_YMD',
    })
    useStartYmd: string;

    @Column('varchar2', {
        name: 'USE_END_YMD',
    })
    useEndYmd: string;

    // @Column('varchar2', {
    //     name: 'NEXT_PAY_YMD'
    // })
    // nextPayYmd: string;

    @Column('number', {
        name: 'INSTALLMENT_CNT',
    })
    installmentCnt: number;

    @Column('number', {
        name: 'PAY_CNT',
    })
    payCnt: number;

    @Column('varchar2', {
        name: 'MEMO',
    })
    memo: string;

    @Column('varchar2', {
        name: 'IS_USE',
    })
    @Transform(({ value }) => value == 'Y')
    isUse?: string;

    @Column('timestamp', {
        name: 'JOIN_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    joinDate: Date;

    @Column('timestamp', {
        name: 'END_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    endDate?: Date;

    @Column('number', {
        name: 'FAIL_CNT',
    })
    failCnt?: number;

    @Column('timestamp', {
        name: 'LAST_FAIL_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    lastFailDate?: Date;

    @UpdateDateColumn({ name: 'MOD_DATE', nullable: true })
    modDate?: Date;

    @Column('number', {
        name: 'P_SETUP_SEQ',
    })
    beforeSetupSeq: number;

    @Column('varchar2', {
        name: 'REG_GBN',
    })
    regGbn: ERegGbn;

    @Column('timestamp', {
        name: 'SYNC_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    syncDate?: Date;
}
