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
