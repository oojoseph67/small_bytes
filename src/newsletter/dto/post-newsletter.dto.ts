import { IsNotEmpty, IsString } from 'class-validator';

export class PostNewsletterDto {
  @IsNotEmpty()
  @IsString()
  markdown: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}
