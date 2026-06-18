import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiResponse } from '../interfaces/response.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data: any) => ({
                statusCode: HttpStatus.OK,
                success: true,
                message: data?.message ?? 'Success',
                data: this.stripMessage(data),
            })),
        );
    }
    private stripMessage(data: any) {
        if (data && typeof data === 'object' && 'message' in data) {
            const copy = { ...data };
            delete copy.message;
            return copy;
        }
        return data;
    }
}
