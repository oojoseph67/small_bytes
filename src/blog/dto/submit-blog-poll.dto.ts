import { IsString, IsNumber, Min } from 'class-validator';

export class SubmitBlogPollDto {
  @IsString()
  pollId: string;

  @IsNumber()
  @Min(0, { message: 'Selected answer must be non-negative' })
  selectedAnswer: number;
}
