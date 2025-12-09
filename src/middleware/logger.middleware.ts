import { NestMiddleware, Injectable, Logger, Inject } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP')

    use(req: Request, res: Response, next: Function) {
        const { method, originalUrl } = req
        const start = Date.now()

        res.on('finish', () => {
            const duration = Date.now() - start
            const text = `${method} ${originalUrl} - ${duration}ms`
            if (duration > 1000) {
                this.logger.log(`${text} (1초 이상 소요)`)
            } else {
                this.logger.log(text)
            }

            console.info(text)
        })
        next()
    }
}
