import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsMongoId()
  quizId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  xpReward: number;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

export class QuizToLessonDto {
  @IsMongoId()
  @IsNotEmpty()
  lessonId: string;

  @IsMongoId()
  @IsNotEmpty()
  quizId: string;
}
