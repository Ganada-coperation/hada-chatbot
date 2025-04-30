import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS 설정 추가
  app.enableCors({
    origin: true,  // 모든 origin 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization']
  });

  const config = new DocumentBuilder()
      .setTitle('Hada Chatbot API')
      .setDescription('Hada Chatbot API Documentation')
      .setVersion('1.0')
      .addTag('swagger')
      .build();

  // config를 바탕으로 swagger document 생성
  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI에 대한 path를 연결함
  // .setup('swagger ui endpoint', app, swagger_document)
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(); // Express의 JSON 응답을 유지하도록 설정

  // ValidationPipe 추가 (decorator를 사용한 유효성 검사)
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
