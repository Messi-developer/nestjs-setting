import { ConfigModule } from '@nestjs/config'
import * as path from 'path'

export class Config {
    public static getModule() {
        if (process.env.NODE_ENV === 'local') {
            return ConfigModule.forRoot({
                envFilePath: path.resolve(`./core/env/.env.${process.env.NODE_ENV}`),
                isGlobal: true,
            })  
        }

        return ConfigModule.forRoot({
            isGlobal: true,
        })
    }
}
