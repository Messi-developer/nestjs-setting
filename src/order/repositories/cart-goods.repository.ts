import { Injectable } from '@nestjs/common'
import { DatabaseConnectionService } from '../../common/services/database-connection.service'
import CommonRepository from '../../common/common.repository'
import { CartEntity } from '../entities/cart.entity'
import { CartGoodsEntity } from '../entities/cart-goods.entity'

@Injectable()
export class CartGoodsRepository extends CommonRepository<CartGoodsEntity> {
    protected table = 'TCART_GOODS'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(CartGoodsEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }

    /**
     * 장바구니 상품 조회
     */
    public async getMemberCartInfoByCode(params) {
        return await this.connection.manager
            .getRepository(CartEntity)
            .createQueryBuilder('cart')
            .select([
                'cart.N_CART_SN as "cartSN"',
                'cartGoods.N_APTI_GOODS_SN as "itemSN"',
                'cartGoods.S_GOODS_NAME as "itemName"',
                'cartGoods.N_PRICE as "price"',
                'cartGoods.N_QUANTITY as "quantity"',
            ])
            .innerJoin(CartGoodsEntity, 'cartGoods', 'cartGoods.N_CART_SN = cart.N_CART_SN')
            .where('cart.N_MEMBER_CODE = :memberCode', { memberCode: params.memberCode })
            .andWhere('cartGoods.N_APTI_GOODS_SN = :itemCode', { itemCode: params.itemCode })
            .getRawOne()
    }

    /**
     * 장바구니 등록된 상품수 확인
     */
    public async getCartGoodsCountByCartSN(params) {
        return await this.connection.manager
            .getRepository(CartGoodsEntity)
            .createQueryBuilder('cartGoods')
            .where('cartGoods.N_CART_SN = :cartSN', { cartSN: params.cartSN })
            .getCount()
    }

    /**
     * 장바구니 상품 조회
     */
    public async getCartItemByCode(params) {
        return await this.connection.manager
            .getRepository(CartEntity)
            .createQueryBuilder('cart')
            .select([
                'cart.N_CART_SN as "cartSN"',
                'cartGoods.N_APTI_GOODS_SN as "itemSN"',
                'cartGoods.S_GOODS_NAME as "itemName"',
                'cartGoods.N_PRICE as "price"',
                'cartGoods.N_QUANTITY as "quantity"',
                'cart.N_RECONTRACT_TYPE as "reContract"',
            ])
            .innerJoin(CartGoodsEntity, 'cartGoods', 'cartGoods.N_CART_SN = cart.N_CART_SN')
            .where('cart.N_MEMBER_CODE = :memberCode', { memberCode: params.memberCode })
            .andWhere('cart.N_CART_SN = :cartSN', { cartSN: params.cartSN })
            .andWhere('cartGoods.N_APTI_GOODS_SN = :itemCode', { itemCode: params.itemCode })
            .getRawOne()
    }

    /**
     * 유저 장바구니 조회
     */
    public async getCartItemsByMemberCode(params) {
        return await this.connection.manager
            .getRepository(CartEntity)
            .createQueryBuilder('cart')
            .select([
                'cart.N_CART_SN as "cartSN"',
                'cartGoods.N_APTI_GOODS_SN as "itemSN"',
                'cartGoods.S_GOODS_NAME as "itemName"',
                'cartGoods.N_PRICE as "price"',
                'cartGoods.N_QUANTITY as "quantity"',
                'cart.DT_CREATE as "created"',
                'cart.N_RECONTRACT_TYPE as "reContract"',
            ])
            .innerJoin(CartGoodsEntity, 'cartGoods', 'cartGoods.N_CART_SN = cart.N_CART_SN')
            .where('cart.N_MEMBER_CODE = :memberCode', { memberCode: params.memberCode })
            .andWhere('cartGoods.S_SERVICE_TYPE = :serviceType', { serviceType: params.serviceType })
            .getRawMany()
    }

    // /**
    //  * 장바구니 단지 정보 조회
    //  */
    // public async getCartComplexInfoByCodes(params) {
    //     return await this.connection.manager
    //         .getRepository(CartGoodsEntity)
    //         .createQueryBuilder('cartGoods')
    //         .select([
    //             'cartGoods.N_APTI_GOODS_SN as "itemSN"',
    //             'cartGoods.S_GOODS_NAME as "itemName"',
    //             'cartGoods.N_PRICE as "price"',
    //             'cartGoods.N_QUANTITY as "quantity"',
    //             'complexMst.COMPLEX_CD as "complexCode"',
    //             'complexMst.COMPLEX_NM as "complexName"',
    //             'complexMst.COMPLEX_GBN as "complexGbn"',
    //             'complexMst.AREA_CD as "areaCode"',
    //         ])
    //         .innerJoin(ComplexMstEntity, 'complexMst', 'cartGoods.N_APTI_GOODS_SN = complexMst.COMPLEX_CD')
    //         .where('complexMst.COMPLEX_CD IN (:...complexCodes)', { complexCodes: params.complexCodes })
    //         .getRawMany()
    // }
}
