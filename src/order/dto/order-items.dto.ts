import { IsNumber, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class OrderItemsNameDTO {
    @IsNumber()
    @Type(() => Number)
    readonly orderSeq: number

    @IsNumber()
    @Type(() => Number)
    readonly memberCode: number

    @IsNumber()
    @Type(() => Number)
    readonly agencyCode: number
}

export class OrderItemsInfoDTO {
    @IsArray()
    @Type(() => Number)
    readonly orderSeq: number[]

    @IsNumber()
    @Type(() => Number)
    readonly memberCode: number

    @IsNumber()
    @Type(() => Number)
    readonly agencyCode: number
}
