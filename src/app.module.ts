import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { ChatModule } from './chat/chat.module';
import { KakaoModule } from './kakao/kakao.module';
import { configValidationSchema } from './config/validation/config-validation';
import databaseConfig from './config/database.config';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [OpenAIModule, ChatModule, KakaoModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: [ '.env.' + process.env.NODE_ENV ],
    validationSchema: configValidationSchema,
    load: [ databaseConfig ],
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

