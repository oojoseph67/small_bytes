import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsMongoId,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the blog post',
    maxLength: 120,
    example: 'Getting Started with NestJS',
  })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the blog post',
    pattern: '^[a-z0-9-]+$',
    example: 'getting-started-with-nestjs',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'The content of the blog post',
    minLength: 100,
    example: 'This is a comprehensive guide to getting started with NestJS...',
  })
  @IsString()
  @MinLength(100)
  content: string;

  @ApiPropertyOptional({
    description: 'The author of the blog post',
    default: 'Small Bytes',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Categories for the blog post (max 5)',
    type: [String],
    example: ['Programming', 'NestJS', 'Backend'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Whether the blog post is published',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Tags for the blog post',
    type: [String],
    example: ['nestjs', 'typescript', 'backend'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Featured image ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'Publication date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
