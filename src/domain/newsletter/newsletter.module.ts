import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Newsletter, NewsletterSchema} from "./newsletter.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Newsletter.name, schema: NewsletterSchema },
    ]),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
  
})
export class NewsletterModule {}
