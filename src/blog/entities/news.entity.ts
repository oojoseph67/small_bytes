import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { BlogMedia } from './blog-media.entity';

@Schema({ timestamps: true })
export class News extends Document {
  @Prop({
    required: true,
    trim: true,
    maxlength: 120,
  })
  title: string;

  @Prop({
    required: true,
    minlength: 50,
  })
  content: string;

  @Prop({
    default: false,
  })
  ticker: boolean;

  @Prop({
    default: false,
  })
  isBreaking: boolean;

  @Prop({
    default: false,
  })
  isFeatured: boolean;

  @Prop({
    default: 'Small Bytes',
  })
  author: string;

  @Prop({
    type: Types.ObjectId,
    ref: BlogMedia.name,
  })
  featuredImage: Types.ObjectId;

  @Prop({
    default: 0,
  })
  viewCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export type NewsDocument = HydratedDocument<News>;

export const NewsSchema = SchemaFactory.createForClass(News);
