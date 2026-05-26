import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import * as dayjs from 'dayjs';

export enum ECardGbn {
    CREDIT = 'A', // 신용카드
    CHECK = 'B', // 체크카드
    GIFT = 'C', // 기프트카드
    OTHER = 'D', // 기타
}

export enum ECardOwnerGbn {
    PERSONAL = 'P', // 개인
    BUSINESS = 'B', // 법인
}

export enum EPayMethodGbn {
    CARD_AUTO = 'B',
    CARD = 'C',
    PAYAT = 'P', // 페이엣(단말기_카드)
    LINK_PRODUCT = 'LP', // 외부 연동 상품
    PAYNOW = 'PN', // 페이나우 (단말기)
    FREE = 'F', // 무료
    KG_CARD = 'KG', // 이니시스 PG
    KG_TERMINAL = 'KT', // 이니시스 단말기
    KG_BILLING = 'KB', // 이니시스 빌링
    KG_VIRTUAL_ACCOUNT = 'KV', // 이니시스 가상계좌
    THE_BIZ_CARD_AUTO = 'THEBIZ_B',
    THE_BIZ_CARD = 'THEBIZ_C',
}

export enum EPayMethodMID {
    TOSS_GENERAL = 'proptier', // thebiz
    TOSS_GENERAL_TEST = 'tproptier', // thebiz_test
    TOOS_BILLING = 'bill_proptier', // bill_thebiz
    PAYAT_GENERAL = 'payat',
    CP_114_CONNECT = 'r114',
    PAYNOW_GENERAL = 'pnb_proptier',
}

@Entity('TB_PAY_METHOD')
export class PayMethodEntity {
    @PrimaryColumn('number', {
        name: 'MEMBER_CD',
    })
    memberCd: number;

    @PrimaryColumn('number', {
        name: 'AGENCY_CD',
    })
    agencyCd: number;

    @PrimaryColumn('number', {
        name: 'PAY_METHOD_NO',
    })
    payMethodNo: number;

    @Column('varchar2', {
        name: 'MID',
    })
    MID: string;

    @Column('varchar2', {
        name: 'CARD_CD',
    })
    cardCd: string;

    @Column('varchar2', {
        name: 'CARD_NO',
    })
    cardNo: string;

    @Column('varchar2', {
        name: 'BILLING_KEY',
    })
    billingKey: string;

    @Column('varchar2', {
        name: 'IS_FAVORITE',
    })
    @Transform(({ value }) => !!value)
    isFavorite?: string;

    @Column('timestamp', {
        name: 'REG_DATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    regDate: Date;

    @Column('timestamp', {
        name: 'DEL_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    delDate?: Date;

    @Column('varchar2', {
        name: 'CARD_GBN',
    })
    cardGbn?: ECardGbn;

    @Column('varchar2', {
        name: 'CARD_OWNER_GBN',
    })
    cardOwnerGbn?: ECardOwnerGbn;

    @Column('varchar2', {
        name: 'PAY_METHOD_GBN',
    })
    payMethodGbn: EPayMethodGbn;
}
