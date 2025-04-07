import {Logger, Module, OnApplicationBootstrap} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './infrastructure/openai/openai.module';
import { ChatModule } from './domain/chat/chat.module';
import { KakaoModule } from './domain/kakao/kakao.module';
import { configValidationSchema } from './config/validation/config-validation';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import {BullModule} from "@nestjs/bull";
import {ArticleQueueModule} from "./domain/kakao/queue/article-queue.module";
import {NewsletterModule} from "./domain/newsletter/newsletter.module";
import {PostModule} from "./domain/post/post.module";
import {UserModule} from "./domain/user/user.module";
import {databaseConfig} from "./config/database.config";
import {bullConfig} from "./config/bull.config";
import {ResponseInterceptor} from "./common/interceptors/response.interceptor";
import {AllExceptionsFilter} from "./common/interceptors/global.exception.interceptor";
import {MailModule} from "./infrastructure/mail/mail.module";


@Module({
  imports: [OpenAIModule, ChatModule, KakaoModule, ArticleQueueModule, NewsletterModule, PostModule, UserModule, MailModule,
    ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: [ '.env.' + process.env.NODE_ENV ], // 실행 환경에 따라 .env 파일을 선택
    validationSchema: configValidationSchema,
  }),
    // MongoDB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    // Redis 연결
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: bullConfig,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

