import { NestMiddleware, Injectable, Inject } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class RequestHeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const isMobile = /Mobi|Dart|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            req.headers['user-agent'],
        )

        req['customDevice'] = isMobile ? 'M' : 'P'

        next()
    }
}
