import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);

    app.enableCors(); // CORS 설정 추가

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();

    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {

    // Warmup 요청 무시
    if (event.source === 'serverless-plugin-warmup') {
        console.log('Lambda is warm!');
        return 'Lambda is warm!';
    }

    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
