import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile({
    file,
    folder = 'collections',
  }: {
    file: any;
    folder?: string;
  }): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

// const [collectionImage, collectionBackgroundImage] = await Promise.all([
//   files.collectionImage?.[0]
//     ? this.cloudinaryService.uploadFile({
//         file: files.collectionImage[0],
//         folder: 'collections/images',
//       })
//     : null,
//   files.collectionBackgroundImage?.[0]
//     ? this.cloudinaryService.uploadFile({
//         file: files.collectionBackgroundImage[0],
//         folder: 'collections/backgrounds',
//       })
//     : null,
// ]);

// if (!collectionImage || !collectionBackgroundImage) {
//   throw new HttpException(
//     'Image upload failed',
//     HttpStatus.INTERNAL_SERVER_ERROR,
//   );
// }

// const url = collectionImage.secure_url
