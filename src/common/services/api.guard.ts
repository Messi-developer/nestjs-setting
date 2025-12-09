import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class ApiGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        
        // this.checkVersion(request)

        return this.validateBearerToken(request)
    }

    // 요청 버전 체크
    private async checkVersion(request: Request): Promise<void> {
        if (!request.headers['version']) {
            throw new UnauthorizedException('Empty Request API Version');
        } else if (
            request.headers['version'] !== '1.0.0'
        ) {
            throw new UnauthorizedException('Not Enough Request Version');
        }
    }

    // 인증토큰 validation (토큰검증, 권한 체크)
    private async validateBearerToken(request: Request) {
        const token = await this.parseAuthToken(request)
        
        if (process.env.INT_API_KEY !== token) {
            throw new UnauthorizedException('Invalid Authorization Token');
        }

        return true
    }

    // 인증 token 반환
    private async parseAuthToken(request: Request): Promise<string> {
        const authorization = request.headers['authorization']

        if (
            authorization &&
            authorization.split(' ')[0].toLowerCase() === 'bearer'
        ) {
            return authorization.split(' ')[1];
        } else {
            throw new UnauthorizedException('Empty Authorization');
        }
    }
}