import { Injectable } from '@nestjs/common'
import { ETabType } from '../dto/order.dto'

@Injectable()
export class OrderAbstractService {
    public constructor() {}

    /**
     * 결제내역 조회 상품 코드
     */
    protected async getGoodsCodesByType(req: { type: ETabType }) {
        switch (req.type) {
            case ETabType.MEMBERSHIP:
                return [10204, 10203, 10202, 10201, 10104, 10103, 10102, 10101, 50003]
            case ETabType.EPHOTO:
                return [40000, 40001, 40002]
        }
    }

    /**
     * 계약구분 정보
     */
    protected async getSubscribeStatsByType(type: number) {
        switch (+type) {
            case 1:
                return `순수신규`
            case 2:
                return `기존신규`
            case 3:
                return `이월재계약`
            case 4:
                return `만기재계약`
            case 5:
                return `변경`
            case 6:
                return `FREE`
            default:
                return `미등록`
        }
    }
}