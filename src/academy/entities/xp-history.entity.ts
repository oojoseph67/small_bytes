import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export enum XPActivityType {
  QUIZ_COMPLETION = 'quiz_completion',
  LESSON_COMPLETION = 'lesson_completion',
  COURSE_COMPLETION = 'course_completion',
  CERTIFICATE_EARNED = 'certificate_earned',
  BONUS = 'bonus',
  PENALTY = 'penalty',
}

@Schema({ timestamps: true, collection: 'xp_history' })
export class XPHistory extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  xpChange: number;

  @Prop({
    type: Number,
    required: true,
  })
  previousXP: number;

  @Prop({
    type: Number,
    required: true,
  })
  newXP: number;

  @Prop({
    type: String,
    enum: XPActivityType,
    required: true,
  })
  activityType: XPActivityType;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
  })
  relatedEntityId?: Types.ObjectId; // Course, Lesson, Quiz, or Certificate ID

  @Prop({
    type: String,
  })
  relatedEntityType?: string; // 'course', 'lesson', 'quiz', 'certificate'

  // Timestamp fields added by timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

export type XPHistoryDocument = HydratedDocument<XPHistory>;

export const XPHistorySchema = SchemaFactory.createForClass(XPHistory);
