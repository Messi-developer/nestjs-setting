import { Injectable, BadRequestException } from '@nestjs/common'
import { CartManagementAbstractService } from './cart-management-abstract.service'
import { DeleteCartDTO } from '../../dto/cart.dto'
import { GetLocationGoodsService } from '../../../pay/unified-goods/services/get-location-goods.service'
import { CartGoodsRepository } from '../../repositories/cart-goods.repository'
import { AptIGoodsRepository } from '../../../pay/unified-goods/repositories/apt-i-goods.repository'
import { CartRepository } from '../../repositories/cart.repository'
import { AptIGoodsStockRepository } from '../../../pay/unified-goods/repositories/apt-i-goods-stock.repository'
import { AptIGoodsStockEntity } from '../../../pay/unified-goods/entities/thebiz/apt-i-goods-stock.entity'
import { CartGoodsEntity } from '../../entities/cart-goods.entity'
import { CartEntity } from '../../entities/cart.entity'

@Injectable()
export class DeleteCartService extends CartManagementAbstractService {
    private req: DeleteCartDTO

    public constructor(
        getLocationGoodsService: GetLocationGoodsService,
        cartGoodsRepository: CartGoodsRepository,
        aptIGoodsRepository: AptIGoodsRepository,
        private readonly cartRepository: CartRepository,
        private readonly aptIGoodsStockRepository: AptIGoodsStockRepository,
    ) {
        super(getLocationGoodsService, cartGoodsRepository, aptIGoodsRepository)
    }

    public async main(req: DeleteCartDTO) {
        this.req = req

        await this.deleteItemsOfCart()

        return {
            message: `장바구니 상품 삭제 되었습니다.`,
        }
    }

    private async deleteItemsOfCart() {
        const newArray = []
        for (const item of this.req.items) {
            // 장바구니 상품 확인
            const check = await this.getCartItemByCode({
                memberCode: this.req.memberCode,
                cartSN: item.cartKey,
                itemCode: item.key,
            })

            if (+check.cartSN === 0) {
                throw new BadRequestException(`장바구니 상품 정보가 없습니다. 다시한번 확인 해주세요.`)
            }

            newArray.push(item.cartKey) // 장바구니 PK 저장

            // 장바구니 상품 삭제
            await this.cartGoodsRepository.deleteData('oracle', CartGoodsEntity, {
                cartSN: +item.cartKey,
                aptIGoodsSN: +item.key,
            })

            // 아파트아이 상품 슬롯 변경
            if (+this.req.serviceType === 1) {
                const stock = await this.aptIGoodsStockRepository.getGoodsStock({ aptIGoodsSN: +item.key })

                if (+stock.aptIGoodsSN > 0) {
                    await this.aptIGoodsStockRepository.updateData('oracle', AptIGoodsStockEntity,
                        { cartQuantity: +stock.cartQuantity - 1 },
                        { aptIGoodsSN: +stock.aptIGoodsSN },
                    )
                }
            }
        }

        // 장바구니 PK 삭제
        const resArray = [...new Set(newArray)] // 중복제거

        if (resArray.length <= 0) return

        for (const item of resArray) {
            const count = await this.cartGoodsRepository.getCartGoodsCountByCartSN({ cartSN: +item })

            // 장바구니 상품수 확인
            if (+count > 0) continue

            await this.cartRepository.deleteData('oracle', CartEntity, { cartSN: +item })
        }
    }
}
