import { Entity, Column, PrimaryColumn } from 'typeorm'
import { Transform } from 'class-transformer'
import * as dayjs from 'dayjs'

@Entity('TCART')
export class CartEntity {
    @PrimaryColumn('number', {
        name: 'N_CART_SN',
    })
    cartSN: number

    @Column('number', {
        name: 'N_MEMBER_CODE',
    })
    memberCode: number

    @Column('number', {
        name: 'N_RECONTRACT_TYPE',
    })
    reContract: number

    @Column({
        type: 'timestamp',
        name: 'DT_CREATE',
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
    createDate: Date
}
