import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './domain/openai/openai.module';
import { ChatModule } from './domain/chat/chat.module';
import { KakaoModule } from './domain/kakao/kakao.module';
import { configValidationSchema } from './config/validation/config-validation';
import databaseConfig from './config/database.config';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [OpenAIModule, ChatModule, KakaoModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: [ '.env.' + process.env.NODE_ENV ], // 실행 환경에 따라 .env 파일을 선택
    validationSchema: configValidationSchema,
    load: [ databaseConfig ],
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

