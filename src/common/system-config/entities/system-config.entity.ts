import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('TB_SYSTEM_CONFIG')
export class SystemConfigEntity {
    @PrimaryColumn()
    systemConfigSeq: number;

    @Column('varchar2', {
        name: 'KIND'
    })
    kind: string;

    @Column('varchar2', {
        name: 'MEMO'
    })
    memo: string;

    @Column('varchar2', {
        name: 'IS_RUN'
    })
    isRun: string;

    @Column('varchar2', {
        name: 'IS_USE'
    })
    isUse: string;

    @Column('clob', {
        name: 'DATA_JSON'
    })
    dataJson: string;

    @Column('date', {
        name: 'START_DATE'
    })
    startDate: Date;

    @Column('date', {
        name: 'END_DATE'
    })
    endDate: Date;
}
