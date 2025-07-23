import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Schema({ timestamps: true, collection: 'user_progress' })
export class UserProgress extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  courseId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Lesson.name,
    required: true,
  })
  lessonId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  isCompleted: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  score: number;

  @Prop({
    type: Number,
    default: 0,
  })
  xpEarned: number;

  @Prop({
    type: Date,
  })
  completedAt?: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  attempts: number;
}

export type UserProgressDocument = HydratedDocument<UserProgress>;

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress); 