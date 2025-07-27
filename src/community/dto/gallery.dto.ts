import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  caption: string;
}

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}

export class GalleryDto {
  @IsString()
  id: string;

  @IsString()
  url: string;

  @IsString()
  caption: string;

  createdAt: Date;
  updatedAt: Date;
}
