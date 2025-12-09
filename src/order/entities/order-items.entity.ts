import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TORDER_ITEMS')
export class OrderItemsEntity {
    @PrimaryColumn('number', {
        name: 'N_ORDER_SN',
    })
    orderSN: number

    @Column('number', {
        name: 'N_ITEM_SN',
    })
    itemSN: number

    @Column('varchar2', {
        name: 'S_SERVICE_TYPE',
    })
    serviceType: string

    @Column('varchar2', {
        name: 'S_ITEM_NAME',
    })
    itemName: string

    @Column('number', {
        name: 'N_PRICE',
    })
    price: number

    @Column('number', {
        name: 'N_QUANTITY',
    })
    quantity: number
}
