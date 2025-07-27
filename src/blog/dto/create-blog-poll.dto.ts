import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsMongoId,
} from 'class-validator';

export class CreateBlogPollDto {
  @IsMongoId()
  blogId: string;

  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'Poll must have at least 2 options' })
  @ArrayMaxSize(6, { message: 'Poll cannot have more than 6 options' })
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @Min(0, { message: 'Correct index must be non-negative' })
  correctIndex: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'XP reward must be at least 1' })
  xpReward?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  explanation?: string;
}
