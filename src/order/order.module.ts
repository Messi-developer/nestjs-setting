import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConnectionService } from '../common/services/database-connection.service'
import { PortalIntApiService } from '../common/api/portal-int-api/portal-int-api.service'
import { PageNationService } from '../common/services/page-nation.service'
// Controllers
import { OrderController } from './orders.controller'
import { CartController } from './cart.controller'
// Entities
import { OrderItemsEntity } from './entities/order-items.entity'
import { CartEntity } from './entities/cart.entity'
import { CartGoodsEntity } from './entities/cart-goods.entity'
import { AptIActionLogEntity } from './entities/apt-i-action-log.entity'
import { AptIGoodsEntity } from '../pay/unified-goods/entities/thebiz/apt-i-goods.entity'
import { AptIGoodsStockEntity } from '../pay/unified-goods/entities/thebiz/apt-i-goods-stock.entity'
// Services
import { OrderAbstractService } from './services/order-abstract.service'
import { OrderInfoService } from './services/order-info.service'
import { OrderCacheService } from './services/order-cache.service'
import { CartManagementAbstractService } from './services/cart/cart-management-abstract.service'
import { SetCartService } from './services/cart/set-cart.service'
import { DeleteCartService } from './services/cart/delete-cart.service'
import { GetCartService } from './services/cart/get-cart.service'
import { GetLocationGoodsService } from '../pay/unified-goods/services/get-location-goods.service'
import { UnifiedGoodsCacheService } from '../pay/unified-goods/services/unified-goods-cache.service'
import { OrderItemNameService } from './services/order-item-name.service'
import { OrderItemsInfoService } from './services/order-items-info.service'
import { OrderHistoriesService } from './services/order-histories.service'
import { AgencyInfoService } from '../agency/services/agency-info.service'
import { AgencyCacheService } from '../agency/services/agency-cache.service'
// Repositories
import { OrderMstRepository } from '../pay/repositories/order-mst.repository'
import { PaySetUpRepository } from '../pay/repositories/pay-set-up.repository'
import { OrderItemsRepository } from './repositories/order-items.repository'
import { PayMethodRepository } from '../pay/repositories/pay-method.repository'
import { CommonCodeRepository } from '../pay/repositories/common-code.repository'
import { CartRepository } from './repositories/cart.repository'
import { CartGoodsRepository } from './repositories/cart-goods.repository'
import { AptIActionLogRepository } from './repositories/apt-i-action-log.repository'
import { AptIGoodsRepository } from '../pay/unified-goods/repositories/apt-i-goods.repository'
import { AptIGoodsStockRepository } from '../pay/unified-goods/repositories/apt-i-goods-stock.repository'
import { AgencyMstRepository } from '../agency/repositories/agency-mst.repository'

@Module({
    imports: [TypeOrmModule.forFeature([
        OrderItemsEntity,
        CartEntity,
        CartGoodsEntity,
        AptIActionLogEntity,
        AptIGoodsEntity,
        AptIGoodsStockEntity,
    ])],
    controllers: [OrderController, CartController],
    providers: [
        DatabaseConnectionService,
        PortalIntApiService,
        PageNationService,
        OrderAbstractService,
        OrderInfoService,
        OrderCacheService,
        CartManagementAbstractService,
        SetCartService,
        DeleteCartService,
        GetCartService,
        GetLocationGoodsService,
        UnifiedGoodsCacheService,
        OrderItemNameService,
        OrderItemsInfoService,
        OrderHistoriesService,
        AgencyInfoService,
        AgencyCacheService,
        // Repositories
        OrderMstRepository,
        PaySetUpRepository,
        OrderItemsRepository,
        PayMethodRepository,
        CommonCodeRepository,
        CartRepository,
        CartGoodsRepository,
        AptIActionLogRepository,
        AptIGoodsRepository,
        AptIGoodsStockRepository,
        AgencyMstRepository,
    ],
    exports: [],
})
export class OrderModule {}
