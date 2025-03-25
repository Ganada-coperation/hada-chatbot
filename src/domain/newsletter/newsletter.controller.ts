import { Controller, Post, Body } from '@nestjs/common';
import { NewsletterService } from 'src/domain/newsletter/newsletter.service';


@Controller('subscribe')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  async subscribe(@Body('email') email: string) {
    return this.newsletterService.subscribe(email);
  }
}
