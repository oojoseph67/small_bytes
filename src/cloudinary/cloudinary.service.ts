import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/cloudinary-response';
import { MulterFile } from './types';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  uploadFile({
    file,
    folder = 'small-bytes',
  }: {
    file: MulterFile;
    folder?: string;
  }): Promise<CloudinaryResponse> {
    this.logger.debug(`uploading image to folder: ${folder}`);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          use_filename: true,
        },
        (error, result) => {
          if (error) {
            this.logger.error('error uploading image');
            return reject(error);
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<boolean> {
    this.logger.debug(`deleting file with public ID: ${publicId}`);

    return new Promise<boolean>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          this.logger.error('error deleting file from cloudinary', error);
          return reject(error);
        }

        this.logger.debug(`file deleted successfully: ${result.result}`);
        resolve(result.result === 'ok');
      });
    });
  }

  extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public ID from Cloudinary URL
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/small-bytes/community-media/filename.jpg
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex((part) => part === 'upload');

      if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
        return null;
      }

      // Get everything after 'upload' and before the file extension
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ''); // Remove file extension

      return publicId;
    } catch (error) {
      this.logger.error('error extracting public ID from URL', error);
      return null;
    }
  }
}
