import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Quiz } from './quiz.entity';
import { Lesson } from './lesson.entity';
import { Course } from './course.entity';

@Schema({ timestamps: true, collection: 'quiz_attempts' })
export class QuizAttempt extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Quiz.name,
    required: true,
  })
  quizId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Lesson.name,
    required: true,
  })
  lessonId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  courseId: Types.ObjectId;

  @Prop([
    {
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
    },
  ])
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];

  @Prop({
    type: Number,
    required: true,
  })
  score: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalQuestions: number;

  @Prop({
    type: Number,
    required: true,
  })
  correctAnswers: number;

  @Prop({
    type: Boolean,
    required: true,
  })
  passed: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  xpEarned: number;

  @Prop({
    type: Number,
    default: 70, // Minimum passing score percentage
  })
  passingScore: number;
}

export type QuizAttemptDocument = HydratedDocument<QuizAttempt>;

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
