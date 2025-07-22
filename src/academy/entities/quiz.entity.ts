import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'quiz' })
export class Quiz extends Document {
  @Prop([
    {
      question: String,
      options: [String],
      correctIndex: Number,
    },
  ])
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export type QuizDocument = HydratedDocument<Quiz>;

export const QuizSchema = SchemaFactory.createForClass(Quiz);
