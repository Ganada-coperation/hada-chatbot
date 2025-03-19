import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);

    app.enableCors(); // CORS 설정 추가

    // Swagger 설정 추가
    const config = new DocumentBuilder()
        .setTitle('Hada Chatbot API')
        .setDescription('Hada Chatbot API Documentation')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document); // API Gateway에서도 Swagger 접근 가능

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();

    // Swagger UI 정적 파일을 서빙할 수 있도록 설정
    expressApp.use('/docs', express.static('node_modules/swagger-ui-dist'));

    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
