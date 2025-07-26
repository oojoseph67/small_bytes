import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class BlogMedia extends Document {
  @Prop({
    required: true,
  })
  url: string;
}

export type BlogMediaDocument = HydratedDocument<BlogMedia>;

export const BlogMediaSchema = SchemaFactory.createForClass(BlogMedia);
