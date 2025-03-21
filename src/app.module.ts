import {Logger, Module, OnApplicationBootstrap} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './domain/openai/openai.module';
import { ChatModule } from './domain/chat/chat.module';
import { KakaoModule } from './domain/kakao/kakao.module';
import { configValidationSchema } from './config/validation/config-validation';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logging.interceptor';

@Module({
  imports: [OpenAIModule, ChatModule, KakaoModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: [ '.env.' + process.env.NODE_ENV ], // 실행 환경에 따라 .env 파일을 선택
    validationSchema: configValidationSchema,
  }),
    // MongoDB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule 로드
      inject: [ConfigService], // ConfigService 주입
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');

        const uri = `${dbHost}`;

        return { uri };

      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

