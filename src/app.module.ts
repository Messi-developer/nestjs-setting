import { Global, Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { RequestHeaderMiddleware } from './middleware/request-header.middleware'
import { ValidationTransFormMiddleware } from './middleware/validation.transform.middleware'
import { HttpExceptionFilter } from './common/exception/http-exception.filter'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Config } from './common/configuration/config'
import { Database } from './common/configuration/database'
// import { SecondaryDatabase } from './common/configuration/secondary-database'
// Modules
import { AgencyModule } from './agency/agency.module'
import { CardModule } from './card/card.module'
import { ChargeModule } from './charge/charge.module'
import { CommonModule } from './common/common.module'
import { CouponModule } from './coupon/coupon.module'
import { CpRegisterModule } from './cp-register/cp-register.module'
import { GoodsModule } from './goods/goods.module'
import { MemberModule } from './member/member.module'
import { NaverTransModule } from './naver-trans/naver-trans.module'
import { OrderModule } from './order/order.module'
import { PayModule } from './pay/pay.module'
import { PreCareReservationModule } from './pre-care-reservation/pre-care-reservation.module'
import { SafeCareModule } from './safe/safe-care.module'
import { SubscribeModule } from './subscribe/subscribe.module'

@Global()
@Module({
    imports: [
        Config.getModule(),
        ...Database.getModule(),
        // ...SecondaryDatabase.getModule(),
        // Modules
        AgencyModule,
        CardModule,
        ChargeModule,
        CommonModule,
        CouponModule,
        CpRegisterModule,
        GoodsModule,
        MemberModule,
        NaverTransModule,
        OrderModule,
        PayModule,
        PreCareReservationModule,
        SafeCareModule,
        SubscribeModule,
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
