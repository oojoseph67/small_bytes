import {
  IsString,
  IsOptional,
  IsBoolean,
  IsMongoId,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'The title of the news article',
    maxLength: 120,
    example: 'Breaking: New Feature Released',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the news article',
    minLength: 50,
    example: 'We are excited to announce the release of our latest feature...',
  })
  @IsString()
  @MinLength(50)
  content: string;

  @ApiPropertyOptional({
    description: 'Whether this news should appear as a ticker',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  ticker?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is breaking news',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isBreaking?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this news should be featured',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'The author of the news article',
    default: 'Small Bytes',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Featured image ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  featuredImage?: string;
}
