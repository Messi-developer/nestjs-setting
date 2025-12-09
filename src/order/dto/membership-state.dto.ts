import { IsNotEmpty, IsString, IsNumber, IsDate, IsArray } from 'class-validator';

export class MembershipStateDTO {
    @IsNumber()
    readonly startPoint?: number = 0;

    @IsNumber()
    readonly endPoint?: number = 100;

    @IsNumber()
    readonly force?: number = 0;
}

export class MembershipStateServiceDTO {
    @IsNumber()
    @IsNotEmpty({ message: `계약구분 확인시 필수값이 누락되었습니다.` })
    readonly agencyCode: number;

    @IsNumber()
    @IsNotEmpty({ message: `계약구분 확인시 필수값이 누락되었습니다.` })
    readonly memberCode: number;

    @IsNumber()
    @IsNotEmpty({ message: `계약구분 확인시 필수값이 누락되었습니다.` })
    readonly membershipState: number;

    @IsDate()
    readonly refundDate?: Date = null;

    @IsDate()
    @IsNotEmpty({ message: `계약구분 확인시 필수값이 누락되었습니다.` })
    readonly endDate: Date;

    @IsString()
    readonly pSetupSeq?: string = null;

    @IsString()
    readonly regGbn?: string = 'G';
}
