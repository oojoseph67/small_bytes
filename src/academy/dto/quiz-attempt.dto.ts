import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuizAnswerDto {
  @IsNumber({}, { message: 'questionIndex must be a valid number' })
  @Min(0, { message: 'questionIndex must be a non-negative number' })
  questionIndex: number;

  @IsNumber({}, { message: 'selectedAnswer must be a valid number' })
  @Min(0, { message: 'selectedAnswer must be a non-negative number' })
  selectedAnswer: number;
}

export class SubmitQuizDto {
  @IsMongoId()
  quizId: string;

  @IsMongoId()
  lessonId: string;

  @IsMongoId()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];
}

export class QuizAttemptResponseDto {
  @IsString()
  id: string;

  @IsNumber()
  score: number;

  @IsNumber()
  totalQuestions: number;

  @IsNumber()
  correctAnswers: number;

  @IsNumber()
  xpEarned: number;

  @IsString()
  passed: boolean;

  @IsString()
  message: string;
}

export class GetQuizAttemptsDto {
  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsMongoId()
  @IsOptional()
  lessonId?: string;
}
