import tracer from 'dd-trace';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@src/common/exception/http-exception.filter';
import { setupSwagger } from './common/configuration/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

if (['development', 'production'].includes(process.env.NODE_ENV)) {
    const servicePrefix = { development: 'dev', production: 'prd', local: 'local' };

    tracer.init({
        service: `${servicePrefix[process.env.NODE_ENV]}-new-portal-bill`,
        env: process.env.NODE_ENV,
        version: '1.22', // 애플리케이션 버전
        hostname: process.env.DD_AGENT_HOST,
        port: +process.env.DD_AGENT_PORT,
        logInjection: true, // 로그에 trace 정보 추가
        runtimeMetrics: true, // 런타임 메트릭 활성화 (CPU, 메모리 사용량 등)
        dbmPropagationMode: 'full', // 데이터베이스 쿼리 추적 활성화
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks(); // Wook Service Shotdown ECS의 종료 캐치

    // DTO Decorator Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 데코레이터 없는 속성은 자동 제거
            forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 들어오면 400 에러
            transform: true, // 요청 데이터를 DTO 클래스 인스턴스로 변환
            transformOptions: {
                enableImplicitConversion: true, // string -> number 등 자동 변환
            },
            forbidUnknownValues: true, // 완전 이상한 값(객체 아님 등) 들어오면 400
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                // 첫 번째 에러 필드의 첫 번째 제약 조건 메시지 추출
                const firstError = errors[0];
                const message = Object.values(firstError.constraints)[0];
                return new BadRequestException({
                    statusCode: 400,
                    message: message,
                    error: 'Bad Request',
                });
            },
        }),
    );

    app.useGlobalFilters(app.get(HttpExceptionFilter));

    setupSwagger(app); // Swagger 문서 설정

    const port = +process.env.APP_PORT > 0 ? +process.env.APP_PORT : 3000;

    const server = await app.listen(port);

    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
}

bootstrap();
