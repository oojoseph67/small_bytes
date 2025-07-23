import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { XPActivityType } from '../entities/xp-history.entity';

export class GetXPHistoryDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  activityType?: XPActivityType;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}

export class XPHistoryResponseDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsNumber()
  xpChange: number;

  @IsNumber()
  previousXP: number;

  @IsNumber()
  newXP: number;

  @IsString()
  activityType: XPActivityType;

  @IsString()
  description: string;

  @IsString()
  relatedEntityId?: string;

  @IsString()
  relatedEntityType?: string;

  @IsString()
  createdAt: string;
}

export class UserXPStatsDto {
  @IsString()
  userId: string;

  @IsNumber()
  currentXP: number;

  @IsNumber()
  totalXP: number;

  @IsNumber()
  totalActivities: number;

  @IsNumber()
  certificatesEarned: number;

  @IsNumber()
  coursesCompleted: number;
} 