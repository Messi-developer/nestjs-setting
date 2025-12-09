import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SetCartDTO } from '../../dto/cart.dto'
import { CartEntity } from '../../entities/cart.entity'
import { CartGoodsEntity } from '../../entities/cart-goods.entity'
import { CartRepository } from '../../repositories/cart.repository'
import { CartGoodsRepository } from '../../repositories/cart-goods.repository'
import { AptIGoodsRepository } from '../../../pay/unified-goods/repositories/apt-i-goods.repository'
import { AptIGoodsStockRepository } from '../../../pay/unified-goods/repositories/apt-i-goods-stock.repository'
import { AptIGoodsStockEntity } from '../../../pay/unified-goods/entities/thebiz/apt-i-goods-stock.entity'
import { GetLocationGoodsService } from '../../../pay/unified-goods/services/get-location-goods.service'

@Injectable()
export class SetCartService {
    private req: SetCartDTO

    public constructor(
        private readonly configService: ConfigService,
        private readonly cartRepository: CartRepository,
        private readonly cartGoodsRepository: CartGoodsRepository,
        private readonly aptIGoodsRepository: AptIGoodsRepository,
        private readonly aptIGoodsStockRepository: AptIGoodsStockRepository,
        private readonly getLocationGoodsService: GetLocationGoodsService,
    ) {}

    public async main(req: SetCartDTO) {
        this.req = req

        await this.cartServiceValidation()

        const cartSeq = await this.setItemsOfCart()

        return {
            cartSeq,
            message: `상품 장바구니 등록 되었습니다.`,
        }
    }

    private async createCartSeq(): Promise<number> {
        const seq = await this.cartRepository.getNextSequence({
            type: 'oracle',
            seqName: 'SEQ_TCART',
            schema: process.env.DB_ORACLE_SCHEMA,
        })

        const insertId = await this.cartRepository.insertData('oracle', CartEntity, {
            cartSN: seq,
            memberCode: +this.req.memberCode,
            reContract: +this.req.reContract, // 1:일반, 2:재계약
        })

        if (insertId.identifiers.length <= 0) {
            throw new BadRequestException('장바구니 등록시 실패했습니다. 관리자에 문의해주세요. (cart)')
        }

        return seq
    }

    /**
     * 카드 등록 가능여부 확인
     */
    private async cartServiceValidation() {
        if (+this.req.items.length === 0) {
            throw new BadRequestException(`장바구니 등록시 상품 정보가 누락되었습니다. 다시한번 확인해주세요.`)
        }

        for (const item of this.req.items) {
            await this.itemValidationCheck({ aptIGoodsSN: +item.key }) // 현재 슬롯 정보 확인 (실시간 필요)

            const cart = await this.cartGoodsRepository.getMemberCartInfoByCode({
                memberCode: +this.req.memberCode,
                itemCode: item.key,
            })

            if (cart) {
                throw new BadRequestException(
                    `이미 장바구니에 등록하신 상품입니다. 장바구니를 확인해주세요. (goodsSN: ${item.key})`,
                )
            }
        }
    }

    private async setItemsOfCart() {
        const cartSeq = await this.createCartSeq() // 장바구니 PK 생성

        switch (+this.req.serviceType) {
            case 1: // 아파트아이
                for (const item of this.req.items) {
                    const stock = await this.aptIGoodsStockRepository.getGoodsStock({ aptIGoodsSN: +item.key }) // 상품 슬롯 정보 확인

                    await this.setCartItem(cartSeq, item) // 장바구니 상품 등록

                    if (+stock.aptIGoodsSN > 0) {
                        await this.aptIGoodsStockRepository.updateData('oracle', AptIGoodsStockEntity,
                            { cartQuantity: +stock.cartQuantity + 1 },
                            { aptIGoodsSN: +stock.aptIGoodsSN },
                        )
                    } else {
                        await this.aptIGoodsStockRepository.insertData('oracle', AptIGoodsStockEntity, {
                            aptIGoodsSN: +item.key,
                            saleQuantity: 0,
                            salePossibleDate: '1900-01-01',
                            renewalContractQuantity: 0,
                            cartQuantity: 1,
                        })
                    }
                }
                break
        }

        return cartSeq
    }

    private async itemValidationCheck(_params) {
        const goods = await this.getLocationGoodsService.main({ aptIGoodsSN: +_params.aptIGoodsSN }) // 구매 가능 수량 확인

        const stock = await this.aptIGoodsStockRepository.getGoodsStock({ aptIGoodsSN: +_params.aptIGoodsSN }) // 현재 슬롯 정보 확인 (실시간 필요)

        if (+this.req.reContract === 2) {
            if (+stock.renewalContractQuantity >= +goods.quantity) {
                throw new BadRequestException('해당 단지는 재계약 구매건수 초과 하였습니다. 다른 단지를 구매해주세요.')
            }
        } else {
            if (+stock.saleQuantity + +stock.cartQuantity >= +goods.quantity) {
                throw new BadRequestException('해당 단지는 구매건수 초과 하였습니다. 다른 단지를 구매해주세요.')
            }
        }

        return stock
    }

    private async setCartItem(cartSN: number, _params) {
        await this.cartGoodsRepository.insertData('oracle', CartGoodsEntity, {
            cartSN,
            aptIGoodsSN: +_params.key,
            serviceType: this.req.serviceType,
            goodsName: _params.name,
            price: +_params.price,
            quantity: +_params.quantity,
        })
    }
}
