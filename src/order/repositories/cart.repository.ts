import { Injectable } from '@nestjs/common'
import { DatabaseConnectionService } from '../../common/services/database-connection.service'
import CommonRepository from '../../common/common.repository'
import { CartEntity } from '../entities/cart.entity'

@Injectable()
export class CartRepository extends CommonRepository<CartEntity> {
    protected table = 'TCART'

    private readonly schema: string

    public constructor(databaseConnectionService: DatabaseConnectionService) {
        super(CartEntity, databaseConnectionService)

        this.schema = process.env.DB_ORACLE_SCHEMA
    }

    /**
     * 장바구니 정보 조회 확인
     */
    public async getCartInfoByCartSN(params) {
        return await this.connection.manager
            .getRepository(CartEntity)
            .createQueryBuilder('cart')
            .select([
                'cart.N_CART_SN as "cartSN"',
                'cart.N_MEMBER_CODE as "memberCode"',
                'cart.N_RECONTRACT_TYPE as "reContract"',
                'cart.DT_CREATE as "createdAt"',
            ])
            .where('cart.N_CART_SN = :cartSN', { cartSN: params.cartSN })
            .andWhere('cart.N_MEMBER_CODE = :memberCode', { memberCode: params.memberCode })
            .getRawOne()
    }
}
