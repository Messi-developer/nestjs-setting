import { Injectable } from '@nestjs/common'
import { OrderItemsRepository } from '../repositories/order-items.repository'
import { GetLocationGoodsService } from '../../pay/unified-goods/services/get-location-goods.service'
import { OrderItemsNameDTO } from '../dto/order-items.dto'

@Injectable()
export class OrderItemNameService {
    public constructor(
        private readonly orderItemsRepository: OrderItemsRepository,
        private readonly getLocationGoodsService: GetLocationGoodsService,
    ) {}

    public async main(req: OrderItemsNameDTO): Promise<string> {
        const items = await this.orderItemsRepository.getOrderItemsByOrderSeq({
            orderSeq: req.orderSeq,
            serviceType: 1,
            memberCode: +req.memberCode,
            agencyCode: +req.agencyCode,
        })

        if (!items) return ``

        let itemName = ``
        for (const [key, item] of items.entries()) {
            // const info = await this.getLocationGoodsService.main({ aptIGoodsSN: +item.itemSN })

            if (key === 0) {
                // itemName += `${info.emd} ${item.itemName}`
                itemName += `${item.itemName}`
            } else {
                // itemName += `, ${info.emd} ${item.itemName}`
                itemName += `, ${item.itemName}`
            }
        }

        return itemName
    }
}
