import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { BlogPoll } from './blog-poll.entity';
import { BlogPost } from './blog.entity';

@Schema({ timestamps: true, collection: 'blog_poll_attempts' })
export class BlogPollAttempt extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: BlogPoll.name,
    required: true,
  })
  pollId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: BlogPost.name,
    required: true,
  })
  blogId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: (selectedAnswer: number) => selectedAnswer >= 0,
      message: 'Selected answer must be non-negative',
    },
  })
  selectedAnswer: number;

  @Prop({
    type: Boolean,
    required: true,
  })
  isCorrect: boolean;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  xpEarned: number;

  @Prop({
    type: String,
    default: 'Blog poll answered',
  })
  description: string;
}

export type BlogPollAttemptDocument = HydratedDocument<BlogPollAttempt>;

export const BlogPollAttemptSchema = SchemaFactory.createForClass(BlogPollAttempt); 