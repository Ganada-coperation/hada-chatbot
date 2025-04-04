import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { Prompts } from './prompt';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [OpenAIService,
        { provide: 'PROMPTS', useValue: Prompts } // NestJS에서 사용할 수 있도록 등록
    ],
    exports: [OpenAIService, 'PROMPTS'],
})
export class OpenAIModule {}
