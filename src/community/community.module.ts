import { Module } from '@nestjs/common';
import { GalleryController } from './controllers/gallery.controller';
import { GalleryService } from './services/community.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class CommunityModule {}
