import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

interface NumPipeOptions {
    message?: string;
    min?: number;
    max?: number;
}

@Injectable()
export class NumPipe implements PipeTransform<string, Promise<number>> {
    constructor(private readonly pipeOptions?: NumPipeOptions) {}

    async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        const field = metadata.data || '값';

        // 1. 숫자 형식 체크 (정규식 또는 Number 함수 이용)
        const isNumeric = !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value as any);

        if (!isNumeric) {
            throw new BadRequestException(this.pipeOptions?.message || `${field} 항목은 숫자여야 합니다.`);
        }

        const num = Number.parseInt(value, 10);

        // 2. 최소값(Min) 검증
        if (this.pipeOptions?.min !== undefined && num < this.pipeOptions.min) {
            throw new BadRequestException(
                this.pipeOptions.message || `${field} 값은 최소 ${this.pipeOptions.min} 이상이어야 합니다.`,
            );
        }

        // 3. 최대값(Max) 검증
        if (this.pipeOptions?.max !== undefined && num > this.pipeOptions.max) {
            throw new BadRequestException(
                this.pipeOptions.message || `${field} 값은 최대 ${this.pipeOptions.max} 이하여야 합니다.`,
            );
        }

        return num;
    }
}
