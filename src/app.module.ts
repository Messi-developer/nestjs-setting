import { Global, Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { RequestHeaderMiddleware } from './middleware/request-header.middleware'
import { ValidationTransFormMiddleware } from './middleware/validation.transform.middleware'
import { HttpExceptionFilter } from './common/exception/http-exception.filter'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Config } from './common/configuration/config'
import { Database } from './common/configuration/database'
import { ClsContextModule } from './common/configuration/cls-context.module'
import { CommonModule } from './common/common.module';

@Global()
@Module({
    imports: [
        Config.getModule(),
        ...Database.getModule(),
        ClsContextModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [AppService, HttpExceptionFilter],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
        consumer.apply(RequestHeaderMiddleware).forRoutes('*')
        consumer
            .apply(ValidationTransFormMiddleware)
            .forRoutes(
                { path: '*', method: RequestMethod.POST },
                { path: '*', method: RequestMethod.PUT },
                { path: '*', method: RequestMethod.PATCH },
            )
    }
}
