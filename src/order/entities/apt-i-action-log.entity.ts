import { Entity, Column, PrimaryColumn } from 'typeorm'
import { Transform } from 'class-transformer'
import * as dayjs from 'dayjs'

@Entity('TAPTI_ACTION_LOG')
export class AptIActionLogEntity {
    @PrimaryColumn({
        type: 'timestamp',
        name: 'DT_CREATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
    createDate: Date

    @Column('number', {
        name: 'N_MEMBER_CODE',
    })
    memberCode: number

    @Column('varchar2', {
        name: 'S_ACTION',
    })
    action: string // 1:변경, 2:주문자 삭제, 3:배치 일괄 삭제, 4:무료지급, 5:환불처리

    @Column('varchar2', {
        name: 'S_CONTENT',
    })
    content: string
}
