import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger: winston.Logger;

    constructor(
        private readonly configService: ConfigService,
        private readonly cls: ClsService,
    ) {
        const logFormat =
            this.configService.get('NODE_ENV') === 'local'
                ? winston.format.combine(
                      winston.format.colorize({ all: true }),
                      winston.format.printf(({ timestamp, level, message, ...meta }) => {
                          return `${level} [${timestamp}] ${message} ${JSON.stringify(meta)}`;
                      }),
                  )
                : winston.format.json();

        this.logger = winston.createLogger({
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
            transports: [new winston.transports.Console()],
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, headers, query, body: reqBody } = req;
        const start = Date.now();

        // Response Body를 가로채기 위한 설정
        const originalSend = res.send;
        let resBody: any;

        // res.send 메서드를 오버라이딩하여 데이터를 가로챕니다.
        res.send = (data) => {
            resBody = data;
            return originalSend.apply(res, [data]);
        };

        res.on('finish', () => {
            const requestId = this.cls.get('x-request-id') || req['x-request-id'] || 'unknown';
            const duration = Date.now() - start;
            const text = `${method} ${originalUrl} - ${duration}ms`;

            //JWT
            let decodedJwt: any = null;
            const authHeader = headers.authorization;

            if (authHeader?.startsWith('Bearer ')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const payload = Buffer.from(token.split('.')[1], 'base64').toString();
                    decodedJwt = JSON.parse(payload);
                } catch {
                    decodedJwt = 'invalid_token';
                }
            }
            const body = this.safeParse(resBody);
            const logData = {
                requestId,
                request: {
                    method,
                    url: originalUrl,
                    headers: headers,
                    jwt: decodedJwt,
                    payload: method === 'GET' ? query : reqBody,
                },
                response: {
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    body,
                },
            };

            if (duration > 1000) {
                this.logger.warn(`${text} (1초 이상 소요)`);
            }
            this.logger.info('HTTP_ACCESS_LOG', logData);
        });

        next();
    }

    private safeParse(body: any) {
        if (!body) return {};
        if (typeof body !== 'string') return body; // 이미 객체면 그대로 반환

        try {
            return JSON.parse(body);
        } catch {
            return body; // JSON이 아니면 그냥 문자열로 반환
        }
    }
}
