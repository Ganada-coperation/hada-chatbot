import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostService } from './service/post.service';
import { PostController } from './post.controller';
import {MailModule} from "../../infrastructure/mail/mail.module";
import {PostMailLogService} from "./service/post-mail-log.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), MailModule],
  controllers: [PostController],
  providers: [PostService, PostMailLogService],
  exports: [PostService],
})
export class PostModule {}
