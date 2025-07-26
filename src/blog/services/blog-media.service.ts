import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BlogMedia, BlogMediaDocument } from '../entities';
import { Model } from 'mongoose';
import { MulterFile } from 'src/cloudinary/types';

@Injectable()
export class BlogMediaService {
  private readonly logger = new Logger(BlogMediaService.name)

  constructor(
    @InjectModel(BlogMedia.name)
    private readonly blogMediaModel: Model<BlogMediaDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadBlogMedia(file: MulterFile): Promise<BlogMediaDocument> {
    const upload = await this.cloudinaryService.uploadFile({
      file: file[0],
      folder: 'small-bytes/blog-media',
    });

    if (!upload) {
      throw new HttpException(
        'Image upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const url = upload.secure_url;

    const blogMedia = await this.blogMediaModel.create({
      url: url,
    });

    return blogMedia;
  }
}
