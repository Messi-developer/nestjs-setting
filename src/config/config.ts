import type { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

export class Config {
    public static getModule(): DynamicModule | Promise<DynamicModule> {
        if (process.env.NODE_ENV === 'local') {
            return ConfigModule.forRoot({
                envFilePath: path.resolve(`./core/env/.env.${process.env.NODE_ENV}`),
                isGlobal: true,
            });
        }

        return ConfigModule.forRoot({
            isGlobal: true,
        });
    }
}
