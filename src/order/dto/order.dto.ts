import { IsNumber, Min, IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import * as dayjs from 'dayjs'

export enum ETabType {
    MEMBERSHIP = 'membership',
    EPHOTO = 'ephoto',
}

export class OrderInfoDto {
    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
        required: true,
    })
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    readonly orderSeq: number
}

export class OrderHistoriesDto {
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: '주문 내역 조회시 필수값이 누락되었습니다. (memberCode)' })
    readonly memberCode: number

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: '주문 내역 조회시 필수값이 누락되었습니다. (agencycode)' })
    readonly agencyCode: number

    @IsEnum(ETabType)
    tabType?: ETabType = ETabType.MEMBERSHIP

    @IsString()
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD') : dayjs().subtract(6, 'month').format('YYYY-MM-DD')))
    readonly startDate?: string = dayjs().subtract(6, 'month').format('YYYY-MM-DD')

    @IsString()
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')))
    readonly endDate?: string = dayjs().format('YYYY-MM-DD')

    @IsString()
    readonly type?: string = 'history'

    @IsNumber()
    @Type(() => Number)
    readonly page?: number = 1

    @IsNumber()
    @Type(() => Number)
    readonly limit?: number = 10
}