import { Injectable, NotFoundException } from "@nestjs/common"
import { OrderInfoDto } from "../dto/order.dto"
import { OrderCacheService } from './order-cache.service'
import { OrderMstRepository } from '../../pay/repositories/order-mst.repository'
import * as dayjs from 'dayjs'

export interface OrderInfoResponse {
    orderSeq: number
    parentOrderSeq: number
    parentSetupSeq: number
    orderId: string
    paymentKey: string
    memberCode: number
    agencyCode: number
    goodsCode: number
    goodsPrc: number
    payPrc: number
    payDate: string
    statusGbn: string
    payMethodNo: number
    payMethodId: string
    payMethodGbn: string
    refundPrc: number
    refundDate: string
    refundReqSeq: number
    paySetupSeq: number
    isUse: string
    useStartYmd: string
    useEndYmd: string
    addComplexCnt: number
    addMemberCnt: number
    contents: string
    memo: string
    regGbn: string
    integratedCode: number
}

@Injectable()
export class OrderInfoService {

    private req: OrderInfoDto

    public constructor(
        private readonly orderCacheService: OrderCacheService,
        private readonly orderMstRepository: OrderMstRepository,
    ) {}

    public async main(req: OrderInfoDto): Promise<OrderInfoResponse> {
        this.req = req

        const cacheKey = `Info:${this.req.orderSeq}`
        const cache = await this.orderCacheService.getCacheData({ cacheKey })

        if (cache.useAble) return cache.data

        const info = await this.orderMstRepository.getOrderInfoByCode({ orderSeq: +this.req.orderSeq })

        if (!info) {
            throw new NotFoundException('주문 정보를 찾을수 없습니다. 관리자에 문의해주세요.')
        }

        info.payDate = dayjs(info.payDate).format('YYYY-MM-DD HH:mm:ss')

        await this.orderCacheService.setCacheData({
            cacheKey,
            data: info,
            extinction: 60 * 60 * 24,
        })

        return info
    }
}