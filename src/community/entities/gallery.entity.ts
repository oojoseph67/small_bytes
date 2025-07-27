import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Gallery extends Document {
  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    required: true,
  })
  caption: string;

  createdAt: Date;
  updatedAt: Date;
}

export type GalleryDocument = HydratedDocument<Gallery>;

export const GallerySchema = SchemaFactory.createForClass(Gallery);
