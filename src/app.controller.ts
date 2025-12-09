import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('bill')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('health')
    public async getCheck() {
        return await this.appService.helth()
    }
}
