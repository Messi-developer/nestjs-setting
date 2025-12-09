import { Injectable, NestMiddleware, Scope } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class ValidationTransFormMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        Object.keys(req.body).map((key) => {
            if (typeof req.body[key] === 'string') req.body[key] = req.body[key].trim()
            return req.body
        })

        next()
    }
}
