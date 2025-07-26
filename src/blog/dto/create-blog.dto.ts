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
import { Transform } from 'class-transformer';

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
    description:
      'Categories for the blog post (max 5). Send as comma-separated string or JSON array string',
    example: 'Programming,NestJS,Backend',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Handle comma-separated string
      if (value.includes(',')) {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
      // Handle JSON array string
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, treat as single item array
        return value ? [value] : [];
      }
    }
    return value;
  })
  categories: string[];

  @ApiPropertyOptional({
    description: 'Whether the blog post is published',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description:
      'Tags for the blog post. Send as comma-separated string or JSON array string',
    example: 'nestjs,typescript,backend',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Handle comma-separated string
      if (value.includes(',')) {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
      // Handle JSON array string
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, treat as single item array
        return value ? [value] : [];
      }
    }
    return value;
  })
  tags: string[];

  // @ApiPropertyOptional({
  //   description: 'Featured image ID',
  //   example: '507f1f77bcf86cd799439011',
  // })
  // @IsOptional()
  // @IsMongoId()
  // featuredImage?: string;

  // @ApiPropertyOptional({
  //   description: 'Publication date',
  //   example: '2024-01-15T10:30:00.000Z',
  // })
  // @IsOptional()
  // @IsDateString()
  // publishedAt?: string;
}
