import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Quiz } from './quiz.entity';

@Schema({ timestamps: true, collection: 'lesson' })
export class Lesson extends Document {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    ref: Quiz.name,
  })
  quiz?: Quiz;

  @Prop({
    type: Number,
    default: 10,
  })
  xpReward: number;
}

export type LessonDocument = HydratedDocument<Lesson>;

export const LessonSchema = SchemaFactory.createForClass(Lesson);
