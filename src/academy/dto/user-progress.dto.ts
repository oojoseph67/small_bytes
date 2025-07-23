import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserProgressDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsMongoId()
  @IsOptional()
  lessonId?: string;
}

export class UserProgressResponseDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsString()
  lessonId: string;

  @IsString()
  isCompleted: boolean;

  @IsNumber()
  score: number;

  @IsNumber()
  xpEarned: number;

  @IsNumber()
  attempts: number;

  @IsString()
  completedAt?: string;
}

export class CourseProgressDto {
  @IsString()
  courseId: string;

  @IsNumber()
  totalLessons: number;

  @IsNumber()
  completedLessons: number;

  @IsNumber()
  totalXP: number;

  @IsNumber()
  averageScore: number;

  @IsString()
  isCompleted: boolean;
}
