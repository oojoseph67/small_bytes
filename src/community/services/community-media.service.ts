import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MulterFile } from 'src/cloudinary/types';

@Injectable()
export class CommunityMediaService {
  private readonly logger = new Logger(CommunityMediaService.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadCommunityMedia({
    file,
    folder,
  }: {
    file: MulterFile;
    folder?: string;
  }): Promise<string> {
    this.logger.debug('Uploading community media');

    const upload = await this.cloudinaryService.uploadFile({
      file: file[0],
      folder: folder || 'small-bytes/community-media',
    });

    // console.log({ upload });

    if (!upload) {
      throw new HttpException(
        'Image upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return upload.secure_url;
  }

  async deleteCommunityMedia(url: string): Promise<boolean> {
    this.logger.debug('Deleting community media');

    const publicId = this.cloudinaryService.extractPublicIdFromUrl(url);

    if (!publicId) {
      throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
    }

    const result = await this.cloudinaryService.deleteFile(publicId);

    if (!result) {
      throw new HttpException(
        'Failed to delete media',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }
}
