import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery, GalleryDocument } from '../entities';
import { Model } from 'mongoose';
import { MulterFile } from 'src/cloudinary/types';
import { CreateGalleryDto } from '../dto';
import { CommunityMediaService } from './community-media.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,

    private readonly communityMediaService: CommunityMediaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createGallery({
    createGalleryDto,
    files,
  }: {
    createGalleryDto: CreateGalleryDto;
    files: {
      image: MulterFile;
    };
  }): Promise<GalleryDocument> {
    this.logger.debug('Creating gallery');
    try {
      if (!files) {
        throw new HttpException(
          `Please upload an image`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const galleryUrl = await this.communityMediaService.uploadCommunityMedia({
        file: files.image,
        folder: 'small-bytes/community-gallery',
      });

      const gallery = await this.galleryModel.create({
        ...createGalleryDto,
        url: galleryUrl,
      });

      this.logger.debug('Gallery created successfully');
      return gallery;
    } catch (error: any) {
      this.logger.error('error creating gallery', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error creating gallery: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllGalleries(): Promise<GalleryDocument[]> {
    this.logger.debug('Fetching all galleries');
    try {
      const galleries = await this.galleryModel.find().exec();

      this.logger.log('Fetched all galleries successfully');

      return galleries;
    } catch (error: any) {
      this.logger.error('Error fetching galleries', error.message);

      throw new HttpException(
        `Error fetching galleries: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGalleryById(id: string): Promise<GalleryDocument> {
    this.logger.debug(`Fetching gallery with ID: ${id}`);
    try {
      const gallery = await this.galleryModel.findById(id).exec();

      if (!gallery) {
        throw new HttpException('Gallery not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log('Fetched gallery successfully');
      return gallery;
    } catch (error: any) {
      this.logger.error(`Error fetching gallery with ID ${id}`, error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching gallery: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteGallery(id: string): Promise<string> {
    this.logger.debug(`Deleting gallery with ID: ${id}`);

    try {
      const gallery = await this.galleryModel.findById(id).exec();

      if (!gallery) {
        throw new HttpException('Gallery not found', HttpStatus.NOT_FOUND);
      }

      await this.communityMediaService.deleteCommunityMedia(gallery.url);
      this.logger.log(`Deleted media for gallery with ID ${id}`);

      await this.galleryModel.findByIdAndDelete(id).exec();

      this.logger.log(`Gallery with ID ${id} deleted successfully`);

      return `Gallery with ID ${id} deleted successfully`;
    } catch (error: any) {
      this.logger.error('error deleting gallery', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error deleting gallery: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
