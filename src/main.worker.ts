// src/main.worker.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    Logger.log('🚀 Worker started and ready to consume Bull queues!');
}

bootstrap();
