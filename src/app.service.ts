import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public async helth() {
        console.log(`--------- health check`)
        return 'health check'
    }
}
