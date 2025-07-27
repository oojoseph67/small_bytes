import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { BlogPost } from './blog.entity';

@Schema({ timestamps: true, collection: 'blog_polls' })
export class BlogPoll extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: BlogPost.name,
    required: true,
  })
  blogId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  question: string;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: (options: string[]) => options.length >= 2 && options.length <= 6,
      message: 'Poll must have between 2 and 6 options',
    },
  })
  options: string[];

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: (correctIndex: number) => correctIndex >= 0,
      message: 'Correct index must be non-negative',
    },
  })
  correctIndex: number;

  @Prop({
    type: Number,
    default: 10,
  })
  xpReward: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
    default: 'Blog poll question related to the article content',
  })
  explanation: string;
}

export type BlogPollDocument = HydratedDocument<BlogPoll>;

export const BlogPollSchema = SchemaFactory.createForClass(BlogPoll); 