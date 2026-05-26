import { Injectable } from '@nestjs/common';
import CommonRepository from '../../common/common.repository';
import { OrderMstEntity } from '@src/order/entities/order-mst.entity';
import { PaySetupEntity } from '@src/order/entities/pay-set-up.entity';
import { PayMethodEntity } from '@src/order/entities/pay-method.entity';
import { MemberMstEntity } from '@src/member/entities/member-mst.entity';
import { DataSource } from 'typeorm';
import { Cacheable } from '@src/common/decorators/cacheable.decorator';

export type membershipResponse = {
    orderSeq: number;
    setUpSeq: number;
    payPrice: number;
    payMethodNo: number;
    goodsCode: number;
    statusGbn: string;
    payDate: string;
    parentOrderSeq: number;
    parentSetUpSeq: number;
    addComplexCnt: number;
    addMemberCnt: number;
    isUse: string;
    regGbn: string;
    useStartYmd: string;
    useEndYmd: string;
    term: number;
    termGbn: string;
    goodsName: string;
    goodsPrice: number;
    rocketPrc: number;
    rocketFreeCnt: number;
    naverTransDiscountPrc: number;
    naverTransDiscountCnt: number;
};

@Injectable()
export class OrderMstRepository extends CommonRepository<OrderMstEntity> {
    protected table = 'TB_ORDER_MST';

    private readonly schema: string;

    public constructor(dataSource: DataSource) {
        super(OrderMstEntity, dataSource);

        this.schema = process.env.DB_ORACLE_DATABASE;
    }

    /**
     * 충전금 주문정보 조회
     */
    @Cacheable(
        (params: { orderSeq: number }) => `portal-int-api:bill:chargeOrderInfoByCode:${params.orderSeq}`,
        10 * 60, // 10분
    )
    public async getOrderInfo(params) {
        return this.connection.manager.getRepository(OrderMstEntity).findOne({
            where: {
                orderSeq: params.orderSeq,
            },
        });
    }

    /**
     * 주문정보 조회
     */
    public async getOrderInfoByCode(params) {
        const query = this.connection.manager.getRepository(OrderMstEntity).createQueryBuilder('mst');

        const integratedCodeSubQuery = query
            .subQuery()
            .select('member.N_INTEGRATION_MEMBER_CODE')
            .from(MemberMstEntity, 'member')
            .where('member.MEMBER_CD = mst.MEMBER_CD')
            .getQuery();

        return await query
            .select([
                'mst.ORDER_SEQ as "orderSeq"',
                'mst.P_ORDER_SEQ as "parentOrderSeq"',
                'setup.P_SETUP_SEQ as "parentSetupSeq"',
                'mst.ORDER_NO as "orderId"',
                'mst.PAYMENT_KEY as "paymentKey"',
                'mst.MEMBER_CD as "memberCode"',
                'mst.AGENCY_CD as "agencyCode"',
                'mst.GOODS_CD as "goodsCode"',
                'mst.GOODS_PRC as "goodsPrc"',
                'mst.PAY_PRC as "payPrc"',
                'mst.PAY_DATE as "payDate"',
                'mst.STATUS_GBN as "statusGbn"',
                'mst.PAY_METHOD_NO as "payMethodNo"',
                'method.MID as "payMethodId"',
                'method.PAY_METHOD_GBN as "payMethodGbn"',
                'mst.REFUND_PRC as "refundPrc"',
                'mst.REFUND_DATE as "refundDate"',
                'mst.REFUND_REQ_SEQ as "refundReqSeq"',
                'mst.PAY_SETUP_SEQ as "paySetupSeq"',
                'setup.IS_USE as "isUse"',
                'setup.USE_START_YMD as "useStartYmd"',
                'setup.USE_END_YMD as "useEndYmd"',
                'setup.ADD_COMPLEX_CNT as "addComplexCnt"',
                'setup.ADD_MEMBER_CNT as "addMemberCnt"',
                'mst.CONTENTS as "contents"',
                'mst.MEMO as "memo"',
                'setup.REG_GBN as "regGbn"',
            ])
            .addSelect(`(${integratedCodeSubQuery})`, 'integratedCode')
            .innerJoin(PaySetupEntity, 'setup', 'mst.PAY_SETUP_SEQ = setup.SETUP_SEQ')
            .innerJoin(
                PayMethodEntity,
                'method',
                'method.PAY_METHOD_NO = mst.PAY_METHOD_NO AND method.MEMBER_CD = mst.MEMBER_CD AND method.AGENCY_CD = mst.AGENCY_CD',
            )
            .where('mst.ORDER_SEQ = :orderSeq', { orderSeq: params.orderSeq })
            .getRawOne();
    }
}
