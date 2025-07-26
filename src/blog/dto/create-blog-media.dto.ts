import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogMediaDto {
  @ApiProperty({
    description: 'The URL of the media file',
    example: 'https://example.com/image.jpg'
  })
  @IsString()
  @IsUrl()
  url: string;
} 