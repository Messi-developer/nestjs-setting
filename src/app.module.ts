import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './config/config';
import { Database } from './config/database';
import { CommonModule } from './common/common.module';
import { ClsContextModule } from './config/cls-context.module';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';

@Module({
    imports: [Config.getModule(), ...Database.getModule(), CommonModule, ClsContextModule],
    controllers: [AppController],
    providers: [AppService, HttpExceptionFilter],
})
export class AppModule {}
