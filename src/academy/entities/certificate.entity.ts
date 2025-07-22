import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'certificate' })
export class Certificate extends Document {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  courseId: string;

  @Prop({
    type: String,
    required: true,
  })
  issuedBy: string;
}

export type CertificateDocument = HydratedDocument<Certificate>;

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
