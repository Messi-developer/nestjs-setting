import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ROUTES } from './common/routes';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get(ROUTES.APP.HEALTH)
    getHealth(): string {
        return this.appService.getHealth();
    }
}
