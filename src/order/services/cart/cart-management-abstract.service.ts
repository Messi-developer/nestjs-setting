import { Injectable } from '@nestjs/common'
import { GetLocationGoodsService } from '../../../pay/unified-goods/services/get-location-goods.service'
import { CartGoodsRepository } from '../../repositories/cart-goods.repository'
import { AptIGoodsRepository } from '../../../pay/unified-goods/repositories/apt-i-goods.repository'

@Injectable()
export class CartManagementAbstractService {
    public constructor(
        protected getLocationGoodsService: GetLocationGoodsService,
        protected cartGoodsRepository: CartGoodsRepository,
        protected aptIGoodsRepository: AptIGoodsRepository,
    ) {}

    /**
     * 장바구니 상품 조회(단건)
     */
    protected async getCartItemByCode(params) {
        const item = await this.cartGoodsRepository.getCartItemByCode({
            memberCode: +params.memberCode,
            cartSN: +params.cartSN,
            itemCode: +params.itemCode,
        })

        if (!item) {
            return { cartSN: 0, itemSN: 0, itemName: ``, price: 0, quantity: 0, reContract: 1 }
        }

        const goods = await this.getLocationGoodsService.main({ aptIGoodsSN: +item.itemSN })

        if (!goods) return item

        item.itemName = `${goods.emd} ${item.itemName}`

        return item
    }

    /**
     * 장바구니 단지 정보 조회
     */
    protected async getContentItemNames(params) {
        let parsedContent = JSON.parse(params.contents)

        if (typeof parsedContent === 'string') {
            parsedContent = JSON.parse(parsedContent) // 이중 JSON 처리
        }

        let itemName = ``
        if (Array.isArray(parsedContent) && parsedContent.length > 0) {
            for (const [key, item] of parsedContent.entries()) {
                const goods = await this.getLocationGoodsService.main({ aptIGoodsSN: +item.itemSN })

                item.itemName = goods ? `${goods.emd} ${goods.complexName}` : ``

                if (key === 0) {
                    itemName += item.itemName
                } else {
                    itemName += `, ${item.itemName}`
                }
            }
        }

        return itemName
    }
}
