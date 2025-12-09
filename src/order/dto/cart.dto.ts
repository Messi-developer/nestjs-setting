import { IsNotEmpty, IsString, IsNumber, Min, IsArray } from 'class-validator'
import { Type, Transform } from 'class-transformer'

class GoodsInfoDTO {
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => (value ? +value : 0), {
        toClassOnly: true,
    })
    key: number

    @IsString()
    readonly name: string

    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => (value ? +value : 0), {
        toClassOnly: true,
    })
    price: number

    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => (value ? +value : 0), {
        toClassOnly: true,
    })
    quantity: number
}

class DeleteInfoDTO {
    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => (value ? +value : 0), {
        toClassOnly: true,
    })
    cartKey: number

    @IsNumber()
    @Type(() => Number)
    @Transform(({ value }) => (value ? +value : 0), {
        toClassOnly: true,
    })
    key: number
}

export class SetCartDTO {
    @IsNumber()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: memberCode)` })
    @Type(() => Number)
    readonly memberCode: number

    @IsString()
    readonly serviceType?: string = '1' // 0: 이실장, 1: 아파트아이

    @IsNumber()
    @Type(() => Number)
    readonly reContract?: number = 1 // 1:일반, 2:재계약

    @IsArray()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: goods)` })
    readonly items: [GoodsInfoDTO]
}

export class DeleteCartDTO {
    @IsNumber()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: memberCode)` })
    @Type(() => Number)
    readonly memberCode: number

    @IsString()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: serviceType)` })
    readonly serviceType?: string = '1'

    @IsArray()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: goods)` })
    readonly items: [DeleteInfoDTO]
}

export class GetCartDTO {
    @IsNumber()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: memberCode)` })
    @Type(() => Number)
    readonly memberCode: number

    @IsString()
    @IsNotEmpty({ message: `장바구니 상품 등록시 필수값이 누락되었습니다. (SetCartDTO: serviceType)` })
    readonly serviceType?: string = '1'
}
