import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Config } from '../config/config';
import { RedisCache } from './services/cache/redis-cache';
import { QueueModule } from './services/queue/queue.module';
import { ResponseService } from './services/response.service';
import { LoggingService } from './services/logging.service';
import { PageNationService } from './services/page-nation.service';

const services = [ResponseService, LoggingService, PageNationService];
const exportedServices = [ResponseService, LoggingService];

@Global()
@Module({
    imports: [Config.getModule(), RedisCache.getModule(), HttpModule, QueueModule],
    providers: [...services],
    exports: [...exportedServices],
})
export class CommonModule {}
