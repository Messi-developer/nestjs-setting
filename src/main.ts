import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './common/interceptors/api-response-interceptor';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
                const message = firstError?.constraints
                    ? Object.values(firstError.constraints)[0]
                    : 'Validation failed';

                return new BadRequestException({
                    statusCode: 400,
                    message: message,
                    error: 'Bad Request',
                });
            },
        }),
    );

    app.useGlobalInterceptors(new ApiResponseInterceptor());

    app.useGlobalFilters(app.get(HttpExceptionFilter));

    if (process.env.NODE_ENV === 'local') setupSwagger(app); // Swagger 문서 설정

    const server = await app.listen(process.env.PORT ?? 3000);

    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
}

bootstrap();
