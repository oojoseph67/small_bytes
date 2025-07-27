import { Module } from '@nestjs/common';
import { GalleryController } from './controllers/gallery.controller';
import { GalleryService } from './services/gallery.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './entities';
import { CommunityMediaService } from './services/community-media.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, CommunityMediaService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Gallery.name,
        schema: GallerySchema,
      },
    ]),

    UserModule,
    CloudinaryModule,
  ],
})
export class CommunityModule {}
