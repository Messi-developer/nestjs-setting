import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
    .setTitle('NewPortal Bill API') // API 제목
    .setDescription('NewPortal Bill API') // API 설명
    .setVersion('1.0.0') // API 버전
    .addTag('bill') // 태그 추가
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'AuthToken',
            in: 'header',
            description: 'intApiAuthToken',
            name: 'Authorization',
        }, 'AuthToken',
    )
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
}