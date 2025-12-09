import { LoggerService, OnModuleInit } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { errors, combine, json, timestamp, ms, prettyPrint } = winston.format;

export class LoggingService implements LoggerService {
    private logger: winston.Logger;

    private hostName: string

    public constructor() {
        this.hostName = process.env.HOSTNAME || 'unknown-host'
    }

    /**
     * Container 실행시 로그파일 생성
     */
    async onModuleInit() {
        await this.createLogger({ fileName: this.hostName, level: 'info' })
    }

    public async createLogger(config: { fileName: string; level: string }) {
        const dailyRotateFileTransport = new DailyRotateFile({
            level: config.level ? config.level : 'info',
            filename: `new-bill-${config.fileName}-%DATE%.log`,
            dirname: 'logs',
            datePattern: 'YYYYMMDD',
            zippedArchive: false, // 오래된 로그를 gzip으로 압축
            maxFiles: 10,
        })
        
        this.logger = winston.createLogger({
            format: combine(errors({ stack: true }), json(), timestamp({ format: 'isoDateTime' }), ms(), prettyPrint()),
            transports: [
                dailyRotateFileTransport,
                new winston.transports.Console({
                    level: process.env.NODE_ENV === 'production' ? `info` : `silly`,
                    format: combine(nestWinstonModuleUtilities.format.nestLike(
                        'new-portal-bill',
                        {
                            colors: true,
                            prettyPrint: true,
                        }
                    )),
                }),
            ],  
        });
    }
        
    public async log(message: string, trace: string) {
        this.logger.info(message, trace);
    }
    public async error(message: string, trace: string) {
        this.logger.error(message, trace);
    }
    public async warn(message: string, trace: string) {
        this.logger.warn(message, trace);
    }
    public async debug(message: string) {
        this.logger.debug(message);
    }
    public async verbose(message: string) {
        this.logger.verbose(message);
    }
}
