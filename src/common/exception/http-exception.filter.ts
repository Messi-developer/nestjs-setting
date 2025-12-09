import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from '../services/response.service';
import { LoggingService } from '../services/logging.service';
import * as dayjs from 'dayjs'
  
@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly responseService: ResponseService, private readonly loggingService: LoggingService) {}

    async catch (exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const res = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        if (['development', 'production'].includes(process.env.NODE_ENV)) {
            if (+exception.getStatus() < 400) return

            const logData = {
                status: exception.getStatus(),
                path: request.url,
                method: request.method,
                exceoption: exception.getResponse(),
                stack: exception.stack,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }

            const contextName = `Status: ${logData.status} - HttpException: ${logData.method}:${logData.path}`

            if (logData.status >= 500) {
                await this.loggingService.error(JSON.stringify(logData), contextName)
            } else if (logData.status >= 400) {
                await this.loggingService.warn(JSON.stringify(logData), contextName)
            } else {
                await this.loggingService.log(JSON.stringify(logData), contextName)
            }
        }

        const errorResponse = this.responseService.errorException(exception);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}