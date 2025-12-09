import { Controller, Post, Body, Delete, Get, Query, UseGuards } from '@nestjs/common'
import { ResponseService } from '../common/services/response.service'
import { DtoValidationPipe } from '../common/validation/dto-validation.pipe'
import { ApiGuard } from '../common/services/api.guard'
import { SetCartDTO, DeleteCartDTO, GetCartDTO } from './dto/cart.dto'
import { SetCartService } from './services/cart/set-cart.service'
import { DeleteCartService } from './services/cart/delete-cart.service'
import { GetCartService } from './services/cart/get-cart.service'

@Controller('bill/cart')
@UseGuards(ApiGuard)
export class CartController {
    public constructor(
        private readonly responseService: ResponseService,
        private readonly setCartService: SetCartService,
        private readonly deleteCartService: DeleteCartService,
        private readonly getCartService: GetCartService,
    ) {}

    /**
     * 장바구니 등록
     */
    @Post('register')
    public async setItemsOfCart(@Body(new DtoValidationPipe()) req: SetCartDTO) {
        const res = await this.setCartService.main(req)
        return this.responseService.success(res)
    }

    /**
     * 장바구니 삭제
     */
    @Delete('delete')
    public async deleteItemOfCart(@Body(new DtoValidationPipe()) req: DeleteCartDTO) {
        const res = await this.deleteCartService.main(req)
        return this.responseService.success(res)
    }

    /**
     * 장바구니 조회
     */
    @Get('items')
    public async getCartItems(@Query(new DtoValidationPipe()) req: GetCartDTO) {
        const res = await this.getCartService.main(req)
        return this.responseService.success(res)
    }
}