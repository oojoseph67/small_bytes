import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogMedia,
  BlogMediaSchema,
  BlogPost,
  BlogPostSchema,
  GlossaryTerm,
  GlossaryTermSchema,
  News,
  NewsSchema,
  BlogPoll,
  BlogPollSchema,
  BlogPollAttempt,
  BlogPollAttemptSchema,
} from './entities';
import { BlogMediaService } from './services/blog-media.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { NewsService } from './services/news.service';
import { GlossaryService } from './services/glossary.service';
import { GlossaryController } from './controllers/glossary.controller';
import { BlogPollController } from './controllers/blog-poll.controller';
import { BlogPollService } from './services/blog-poll.service';
import { AcademyModule } from 'src/academy/academy.module';
import { BlogNotificationService } from './services/blog-notification.service';
import { EmailModule } from 'src/email/email.module';

// TODO: integrate news ticker api and news service, entity and controller

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlogMedia.name,
        schema: BlogMediaSchema,
      },
      {
        name: BlogPost.name,
        schema: BlogPostSchema,
      },
      {
        name: GlossaryTerm.name,
        schema: GlossaryTermSchema,
      },
      {
        name: News.name,
        schema: NewsSchema,
      },
      {
        name: BlogPoll.name,
        schema: BlogPollSchema,
      },
      {
        name: BlogPollAttempt.name,
        schema: BlogPollAttemptSchema,
      },
    ]),

    CloudinaryModule,
    UserModule,
    AcademyModule,
    EmailModule,
  ],
  controllers: [BlogController, GlossaryController, BlogPollController],
  providers: [
    BlogService,
    BlogMediaService,
    NewsService,
    GlossaryService,
    BlogPollService,
    BlogNotificationService,
  ],
})
export class BlogModule {}
