import { Injectable } from '@nestjs/common'
import { OrderItemsRepository } from '../repositories/order-items.repository'
import { GetLocationGoodsService } from '../../pay/unified-goods/services/get-location-goods.service'
import { OrderItemsInfoDTO } from '../dto/order-items.dto'

@Injectable()
export class OrderItemsInfoService {
    public constructor(
        private readonly orderItemsRepository: OrderItemsRepository,
        private readonly getLocationGoodsService: GetLocationGoodsService,
    ) {}

    public async main(req: OrderItemsInfoDTO) {
        const items = await this.orderItemsRepository.getOrderItemComplexInfoByOrderSeq({
            orderSeq: req.orderSeq,
            serviceType: 1,
            memberCode: +req.memberCode,
            agencyCode: +req.agencyCode,
        })

        if (!items) return

        const goodsSN = []
        const complexCodes = []

        for (const [key, item] of items.entries()) {
            goodsSN.push(+item.itemSN)
            complexCodes.push(+item.complexCode)
        }

        return {
            goodsSN,
            complexCodes,
        }
    }
}
