import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ResponseService } from '../common/services/response.service'
import { DtoValidationPipe } from '../common/validation/dto-validation.pipe'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ApiGuard } from '../common/services/api.guard'
import { OrderInfoDto, OrderHistoriesDto } from './dto/order.dto'
import { OrderInfoService } from './services/order-info.service'
import { OrderHistoriesService } from './services/order-histories.service'

@Controller('bill/order')
@UseGuards(ApiGuard)
export class OrderController {
    public constructor(
        private readonly responseService: ResponseService,
        private readonly orderInfoService: OrderInfoService,
        private readonly orderHistoriesService: OrderHistoriesService,
    ) {}

    /**
     * 주문 정보 조회
     */
    @Get('info')
    @ApiOperation({
        summary: '주문 정보 조회',
        description: '주문 정보 조회 (PK: OrderMaster.Seq)',
    })
    @ApiBody({
        type: OrderInfoDto,
        description: '사용자 생성에 필요한 데이터',
    })
    @ApiResponse({
        status: 201,
        description: '사용자가 성공적으로 생성됨.',
        type: OrderInfoDto, // 응답 데이터의 구조를 표시 (선택 사항)
    })
    @ApiResponse({ status: 400, description: '잘못된 요청 데이터.' })
    public async getOrderInfo(@Query(new DtoValidationPipe()) req: OrderInfoDto) {
        const res = await this.orderInfoService.main(req)
        return this.responseService.success(res)
    }

    /**
     * 주문 내역 리스트 조회
     */
    @Get('histories')
    public async getOrderHistories(@Query(new DtoValidationPipe()) req: OrderHistoriesDto) {
        const res = await this.orderHistoriesService.main(req)
        return this.responseService.success(res)
    }
}
