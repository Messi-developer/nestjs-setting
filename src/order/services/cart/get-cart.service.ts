import { Injectable } from '@nestjs/common'
import { GetCartDTO } from '../../dto/cart.dto'
import { CartGoodsRepository } from '../../repositories/cart-goods.repository'
import * as dayjs from 'dayjs'

@Injectable()
export class GetCartService {
    private req: GetCartDTO

    public constructor(private readonly cartGoodsRepository: CartGoodsRepository) {}

    public async main(req: GetCartDTO) {
        this.req = req

        return await this.getCartItems()
    }

    private async getCartItems() {
        const items = await this.cartGoodsRepository.getCartItemsByMemberCode({
            memberCode: this.req.memberCode,
            serviceType: this.req.serviceType,
        })

        if (+items.length <= 0) return []

        // cartSN 기준으로 그룹화
        return items.reduce((acc, item) => {
            // 해당 cartSN이 이미 존재하면 배열에 추가, 없으면 새 배열 생성
            acc[item.cartSN] = acc[+item.cartSN] || []
            item.created = dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')

            acc[item.cartSN].push(item)
            return acc
        }, {})
    }
}
