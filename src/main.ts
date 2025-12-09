import tracer from 'dd-trace'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from '@src/common/exception/http-exception.filter'
import { setupSwagger } from './common/configuration/swagger'

if (['development', 'production'].includes(process.env.NODE_ENV)) {
    const servicePrefix = { development: 'dev', production: 'prd', local: 'local' }

    tracer.init({
        service: `${servicePrefix[process.env.NODE_ENV]}-new-portal-bill`,
        env: process.env.NODE_ENV,
        version: '1.22', // 애플리케이션 버전
        hostname: process.env.DD_AGENT_HOST,
        port: +process.env.DD_AGENT_PORT,
        logInjection: true, // 로그에 trace 정보 추가
        runtimeMetrics: true, // 런타임 메트릭 활성화 (CPU, 메모리 사용량 등)
        dbmPropagationMode: 'full', // 데이터베이스 쿼리 추적 활성화
    })
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(app.get(HttpExceptionFilter))

    setupSwagger(app) // Swagger 문서 설정

    const port = +process.env.APP_PORT > 0 ? +process.env.APP_PORT : 3000

    const server = await app.listen(port)

    server.keepAliveTimeout = 61 * 1000
    server.headersTimeout = 65 * 1000
}

bootstrap()
