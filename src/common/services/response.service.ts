import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { ApiResponse } from './response.interface'

@Injectable()
export class ResponseService {
    async success<T>(data: T, message = data['message'] ? data['message'] : 'Success', statusCode = HttpStatus.OK): Promise<ApiResponse<T>> {
        const responseData = await this.getResponseData(data);

        return {
            statusCode,
            success: true,
            message,
            data: responseData,
        }
    }

    created<T>(data: T, statusCode = HttpStatus.CREATED, message = 'Resource created successfully'): ApiResponse<T> {
        return {
            statusCode,
            success: true,
            message,
            data,
        }
    }
    
    deleted(message = 'Resource deleted successfully', statusCode = HttpStatus.OK): ApiResponse<null> {
        return {
            statusCode,
            success: true,
            message,
            data: null,
        };
    }

    /**
     * Error Exception Formatting
     */
    errorException(exception: HttpException): ApiResponse {
        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = 'fromException Error Message';
        let error = null;

        switch(typeof exceptionResponse) {
            case 'string':
                message = exceptionResponse;
                break;
            case 'object':
                const res = exceptionResponse as Record<string, any>;
                message = res.message || message;
                error = res.error || null;
                break
        }

        return {
            statusCode,
            success: false,
            message,
            data: {},
            error,
        };
    }

    private async getResponseData(data: any) {
        if ('message' in data) {
            delete data['message'];
        }

        return data;
    }
}