import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { BlogMedia } from './blog-media.entity';

@Schema({ timestamps: true })
export class BlogPost extends Document {
  @Prop({
    required: true,
    trim: true,
    maxlength: 120,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: /^[a-z0-9-]+$/,
  })
  slug: string;

  @Prop({
    required: true,
    minlength: 100,
  })
  content: string;

  @Prop({
    default: 'Small Bytes',
  })
  author: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (categories: string[]) => categories.length <= 5,
      message: 'Cannot have more than 5 categories',
    },
  })
  categories: string[];

  @Prop({
    default: false,
  })
  isPublished: boolean;

  @Prop({
    default: 0,
  })
  viewCount: number;

  @Prop([String])
  tags: string[];

  @Prop({
    type: Types.ObjectId,
    ref: BlogMedia.name,
  })
  featuredImage: BlogMedia;

  @Prop()
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogPostDocument = HydratedDocument<BlogPost>;

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
