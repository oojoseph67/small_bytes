import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
