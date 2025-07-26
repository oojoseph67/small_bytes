import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
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
} from './entities';

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
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
