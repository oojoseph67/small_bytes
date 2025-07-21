import { IsEmail, IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsletterDto {
  @ApiProperty({
    description: 'Email address for newsletter subscription',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'First name of the subscriber',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the subscriber',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorizing subscribers',
    example: ['tech', 'updates'],
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Additional metadata for the subscription',
    example: { source: 'website', campaign: 'winter2024' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
