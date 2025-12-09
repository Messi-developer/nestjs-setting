import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class DtoValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = object ? await validate(object) : []

        if (errors.length > 0) {
            throw new BadRequestException(this.parseFirstMessage(errors))
        }
        return object
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }

    private parseFirstMessage(errors: Array<ValidationError>): string {
        if (errors[0].children.length > 0) {
            return this.parseFirstMessage(errors[0].children)
        } else {
            return errors[0].constraints[Object.keys(errors[0].constraints)[0]]
        }
    }
}
