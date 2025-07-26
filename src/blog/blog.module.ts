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
import { BlogMediaService } from './services/blog-media.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';

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

    CloudinaryModule,
    UserModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogMediaService],
})
export class BlogModule {}
