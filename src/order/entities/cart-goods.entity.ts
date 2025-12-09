import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TCART_GOODS')
export class CartGoodsEntity {
    @PrimaryColumn('number', {
        name: 'N_CART_SN',
    })
    cartSN: number

    @Column('number', {
        name: 'N_APTI_GOODS_SN',
    })
    aptIGoodsSN: number

    @Column('varchar2', {
        name: 'S_SERVICE_TYPE',
    })
    serviceType: string

    @Column('varchar2', {
        name: 'S_GOODS_NAME',
    })
    goodsName: string

    @Column('number', {
        name: 'N_PRICE',
    })
    price: number

    @Column('number', {
        name: 'N_QUANTITY',
    })
    quantity: number
}
