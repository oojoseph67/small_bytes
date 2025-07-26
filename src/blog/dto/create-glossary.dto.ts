import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGlossaryDto {
  @ApiProperty({
    description: 'The glossary term',
    example: 'API',
  })
  @IsString()
  term: string;

  @ApiProperty({
    description: 'The definition of the term',
    example:
      'Application Programming Interface - a set of rules that allows one software application to interact with another.',
  })
  @IsString()
  definition: string;

  @ApiPropertyOptional({
    description: 'Abbreviation of the term',
    example: 'API',
  })
  @IsOptional()
  @IsString()
  abbreviation?: string;

  @ApiPropertyOptional({
    description: 'Related terms',
    type: [String],
    example: ['REST', 'GraphQL', 'Webhook'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedTerms?: string[];

  @ApiPropertyOptional({
    description: 'Categories for the term',
    type: [String],
    example: ['Programming', 'Web Development', 'Backend'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
