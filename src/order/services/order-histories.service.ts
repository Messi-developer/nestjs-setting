import { Injectable } from '@nestjs/common'
import { OrderHistoriesDto, ETabType } from '../dto/order.dto'
// Services
import { PageNationService, ResponsePageNation } from '../../common/services/page-nation.service'
import { OrderAbstractService } from './order-abstract.service'
import { AgencyInfoService } from '../../agency/services/agency-info.service'
import { OrderCacheService } from './order-cache.service'
// Repositories
import { PaySetUpRepository } from '../../pay/repositories/pay-set-up.repository'
import { PayMethodRepository } from '../../pay/repositories/pay-method.repository'
import { CommonCodeRepository } from '../../pay/repositories/common-code.repository'
import * as dayjs from 'dayjs'

@Injectable()
export class OrderHistoriesService extends OrderAbstractService {
    private req: OrderHistoriesDto

    private pageNation: ResponsePageNation

    private offset: number

    private goodsCodes: number[]

    public constructor(
        private readonly orderCacheService: OrderCacheService,
        private readonly pageNationService: PageNationService,
        private readonly agencyInfoService: AgencyInfoService,
        private readonly paySetUpRepository: PaySetUpRepository,
        private readonly payMethodRepository: PayMethodRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
    ) {
        super()
    }

    public async main(req: OrderHistoriesDto) {
        this.req = req

        this.offset = (+this.req.page - 1) * +this.req.limit

        const cacheKey = `OrderHistories:${this.req.tabType}:${this.req.memberCode}:${this.req.agencyCode}:${this.req.startDate}:${this.req.endDate}:${this.req.page}:${this.req.limit}`
        const cachedData = await this.orderCacheService.getCacheData({ cacheKey })

        if (cachedData.useAble) return cachedData.data

        await this.serviceValidation()

        const count = await this.getHisotryCount()

        if (+count <= 0) {
            return {
                items: [],
                pagingInfo: {
                    totalCount: 0,
                },
            }
        }

        this.pageNation = await this.pageNationService.pageNation({
            total: count,
            page: this.req.page,
            limit: this.req.limit,
        })

        const items = await this.getOrderHistories() // 주문 내역 확인

        await this.orderCacheService.setCacheData({
            cacheKey,
            data: {
                count: +count,
                items,
                pageable: this.pageNation,
            },
            extinction: 30, // 30초
        })
        return {
            count: +count,
            items,
            pageable: this.pageNation,
        }
    }

    private async serviceValidation() {
        await this.agencyInfoService.main(+this.req.agencyCode) // 중개사 정보 조회

        this.goodsCodes = await this.getGoodsCodesByType({ type: this.req.tabType }) // 상품 코드 조회
    }

    private async getHisotryCount() {
        return await this.paySetUpRepository.getSubscribeHistoryCount({
            memberCode: +this.req.memberCode,
            agencyCode: +this.req.agencyCode,
            goodsCode: this.goodsCodes,
            type: this.req.type,
            startDate: `${this.req.startDate} 00:00:00`,
            endDate: `${this.req.endDate} 23:59:59`,
        })
    }

    private async getOrderHistories() {
        const histories = await this.paySetUpRepository.getSubscribeHistories({
            memberCode: +this.req.memberCode,
            agencyCode: +this.req.agencyCode,
            goodsCode: this.goodsCodes,
            type: this.req.type,
            startDate: `${this.req.startDate} 00:00:00`,
            endDate: `${this.req.endDate} 23:59:59`,
        })

        if (histories.length <= 0) return []

        for (const history of histories) {
            await this.historyFormatting(history)
        }

        return histories
    }

    private async historyFormatting(_params) {
        // 결제 정보 조회
        const method = await this.payMethodRepository.getPaymentMethodInfoByNo({
            methodNo: _params.payMethodNo,
            memberCode: this.req.memberCode,
            agencyCode: this.req.agencyCode,
        })

        _params.parentOrderSeq = _params.parentOrderSeq ?? 0
        _params.parentSetUpSeq = _params.parentSetUpSeq ?? 0
        _params.memo = _params.memo ?? ''

        // 결제시 정보 파싱
        let serviceContent = JSON.parse(_params.contents)

        if (typeof serviceContent === 'string') {
            serviceContent = JSON.parse(serviceContent) // 이중 JSON 처리
        }
        _params.contents = serviceContent

        _params.cardCode = method.cardCode === null ? '00' : method.cardCode

        _params.cardName = ``
        if (method.cardCode !== null) {
            const info = await this.commonCodeRepository.getSystemInfoByCode({
                classCode: '022',
                mainCode: +method.cardCode,
            })
            _params.cardName = info.mainName
        }

        _params.payMethodGbn = method.payMethodGbn

        _params.regDate = dayjs(_params.regDate).format('YYYY-MM-DD HH:mm:ss')

        _params.subscribeState = await this.getSubscribeStatsByType(+_params.subscribeState) // 계약 구분 조회

        _params.refundPrice = _params.refundPrice === null ? 0 : +_params.refundPrice
        _params.refundDate =
            _params.refundDate === null
                ? '1900-01-01 00:00:00'
                : dayjs(_params.refundDate).format('YYYY-MM-DD HH:mm:ss')
    }
}