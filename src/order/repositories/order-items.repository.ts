import { Injectable } from '@nestjs/common'
import { DatabaseConnectionService } from '../../common/services/database-connection.service'
import CommonRepository from '../../common/common.repository'
import { OrderItemsEntity } from '../entities/order-items.entity'
import { OrderMstEntity } from '../../pay/entities/order-mst.entity'
import { PaySetupEntity } from '../../pay/entities/pay-set-up.entity'
import { AptIGoodsEntity } from '../../pay/unified-goods/entities/thebiz/apt-i-goods.entity'

@Injectable()
export class OrderItemsRepository extends CommonRepository<OrderItemsEntity> {
    protected table = 'TORDER_ITEMS'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(OrderItemsEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }

    /**
     * 이용중 주문 상품 정보 조회
     */
    public async getOrderItems(params) {
        return await this.connection.manager
            .getRepository(OrderItemsEntity)
            .createQueryBuilder('items')
            .select([
                'mst.ORDER_SEQ as "orderSeq"',
                'items.N_ITEM_SN as "itemSN"',
                'items.S_ITEM_NAME as "itemName"',
                'items.N_PRICE as "price"',
                'items.N_QUANTITY as "quantity"',
            ])
            .innerJoin(OrderMstEntity, 'mst', 'items.N_ORDER_SN = mst.ORDER_SEQ')
            .innerJoin(PaySetupEntity, 'setup', 'mst.PAY_SETUP_SEQ = setup.SETUP_SEQ')
            .where('items.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .andWhere('mst.MEMBER_CD = :memberCode', { memberCode: params.memberCode })
            .andWhere('mst.AGENCY_CD = :agencyCode', { agencyCode: params.agencyCode })
            .andWhere('setup.IS_USE = :isUse', { isUse: 'Y' })
            .getRawMany()
    }

    /**
     * 이용중인 주문건 중 재계약 상품 조회
     */
    public async getRePaymentOrderItems(params) {
        return await this.connection.manager
            .getRepository(OrderItemsEntity)
            .createQueryBuilder('items')
            .select([
                'mst.ORDER_SEQ as "orderSeq"',
                'items.N_ITEM_SN as "itemSN"',
                'items.S_ITEM_NAME as "itemName"',
                'items.N_PRICE as "price"',
                'items.N_QUANTITY as "quantity"',
                'setup.USE_START_YMD as "useStartYmd"',
                'setup.USE_END_YMD as "useEndYmd"',
            ])
            .innerJoin(OrderMstEntity, 'mst', 'items.N_ORDER_SN = mst.ORDER_SEQ')
            .innerJoin(PaySetupEntity, 'setup', 'mst.PAY_SETUP_SEQ = setup.SETUP_SEQ')
            .where('items.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .andWhere('mst.MEMBER_CD = :memberCode', { memberCode: params.memberCode })
            .andWhere('mst.AGENCY_CD = :agencyCode', { agencyCode: params.agencyCode })
            .andWhere(
                "(TO_DATE(setup.USE_END_YMD, 'YYYYMMDD') - 30 <= TO_DATE(:checkDate, 'YYYYMMDD') AND TO_DATE(setup.USE_END_YMD, 'YYYYMMDD') >=  TO_DATE(:checkDate, 'YYYYMMDD'))",
                { checkDate: params.checkDate },
            )
            // .andWhere('(setup.USE_END_YMD - 30 <= TRUNC(:checkDate) AND setup.USE_END_YMD >= TRUNC(:checkDate))', {
            //     checkDate: params.checkDate,
            // })
            .andWhere('setup.GOODS_CD IN (:...goodsCode)', { goodsCode: params.goodsCode })
            .andWhere('setup.IS_USE = :isUse', { isUse: 'Y' })
            .getRawMany()
    }

    /**
     * 재계약 구매 단지 정보 조회
     */
    public async getRePaymentOrderItemByGoodsSn(params) {
        return await this.connection.manager
            .getRepository(OrderItemsEntity)
            .createQueryBuilder('items')
            .innerJoin(OrderMstEntity, 'mst', 'items.N_ORDER_SN = mst.ORDER_SEQ')
            .innerJoin(PaySetupEntity, 'setup', 'mst.PAY_SETUP_SEQ = setup.SETUP_SEQ')
            .where('items.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .andWhere('mst.MEMBER_CD = :memberCode', { memberCode: params.memberCode })
            .andWhere('mst.AGENCY_CD = :agencyCode', { agencyCode: params.agencyCode })
            .andWhere('setup.GOODS_CD IN (:...goodsCode)', { goodsCode: params.goodsCode })
            .andWhere('setup.IS_USE = :isUse', { isUse: 'Y' })
            .andWhere('items.N_ITEM_SN = :aptIGoodsSN', { aptIGoodsSN: params.aptIGoodsSN })
            .getCount()
    }

    /**
     * 주문번호로 상품 조회
     */
    public async getOrderItemsByOrderSeq(params) {
        return await this.connection.manager
            .getRepository(OrderItemsEntity)
            .createQueryBuilder('items')
            .select([
                'mst.ORDER_SEQ as "orderSeq"',
                'items.N_ITEM_SN as "itemSN"',
                'items.S_ITEM_NAME as "itemName"',
                'items.N_PRICE as "price"',
                'items.N_QUANTITY as "quantity"',
            ])
            .innerJoin(OrderMstEntity, 'mst', 'items.N_ORDER_SN = mst.ORDER_SEQ')
            .where('items.N_ORDER_SN = :orderSeq', { orderSeq: params.orderSeq })
            .andWhere('items.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .andWhere('mst.MEMBER_CD = :memberCode', { memberCode: params.memberCode })
            .andWhere('mst.AGENCY_CD = :agencyCode', { agencyCode: params.agencyCode })
            .getRawMany()
    }

    /**
     * 주문번호로 단지 정보 조회
     */
    public async getOrderItemComplexInfoByOrderSeq(params) {
        return await this.connection.manager
            .getRepository(OrderItemsEntity)
            .createQueryBuilder('items')
            .select([
                'mst.ORDER_SEQ as "orderSeq"',
                'items.N_ITEM_SN as "itemSN"',
                'items.S_ITEM_NAME as "itemName"',
                'items.N_PRICE as "price"',
                'items.N_QUANTITY as "quantity"',
                'goods.N_COMPLEX_CD as "complexCode"',
            ])
            .innerJoin(OrderMstEntity, 'mst', 'items.N_ORDER_SN = mst.ORDER_SEQ')
            .innerJoin(AptIGoodsEntity, 'goods', 'items.N_ITEM_SN = goods.N_APTI_GOODS_SN')
            .where('items.N_ORDER_SN IN (:...orderSeq)', { orderSeq: params.orderSeq })
            .andWhere('items.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .andWhere('mst.MEMBER_CD = :memberCode', { memberCode: params.memberCode })
            .andWhere('mst.AGENCY_CD = :agencyCode', { agencyCode: params.agencyCode })
            .getRawMany()
    }
}
