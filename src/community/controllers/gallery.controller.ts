import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { MulterFile } from 'src/cloudinary/types';
import { CreateGalleryDto } from '../dto';
import { GalleryService } from '../services/gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.GALLERY, actions: [Action.CREATE] }])
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async createGallery(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFiles()
    files: {
      image: MulterFile;
    },
  ) {
    return await this.galleryService.createGallery({ createGalleryDto, files });
  }

  @Get()
  async getAllGalleries() {
    return await this.galleryService.getAllGalleries();
  }

  @Get(':id')
  async getGalleryById(@Param('id') id: string) {
    return await this.galleryService.getGalleryById(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.GALLERY, actions: [Action.DELETE] }])
  async deleteGallery(@Param('id') id: string) {
    return await this.galleryService.deleteGallery(id);
  }
}
