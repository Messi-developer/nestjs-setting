import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ROUTES } from './common/routes'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get(ROUTES.APP.HEALTH)
    public async getCheck() {
        return await this.appService.helth()
    }
}
