import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  Min,
  ArrayMinSize,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// Nested DTOs for creating complete course structure
export class CreateQuizNestedDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @Min(0)
  @Max(3) // Assuming 4 options (0-3)
  correctIndex: number;
}

export class CreateLessonNestedDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  xpReward?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateQuizNestedDto)
  quiz?: CreateQuizNestedDto;
}

export class CreateCertificateNestedDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  issuedBy: string;
}

// Main DTO for creating complete course
export class CreateCourseCompleteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCertificateNestedDto)
  certificate?: CreateCertificateNestedDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonNestedDto)
  lessons: CreateLessonNestedDto[];
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsArray()
  @IsOptional()
  @IsMongoId()
  lessons?: string[];

  @IsOptional()
  @IsMongoId()
  certificate?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export class SetCourseCertificateDto {
  @IsMongoId()
  @IsNotEmpty()
  certificateId: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}

export class SetLessonToCourseDto {
  @IsMongoId()
  @IsNotEmpty()
  lessonId: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}
