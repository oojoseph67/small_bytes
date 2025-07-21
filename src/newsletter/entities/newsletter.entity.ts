import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

// NewsletterSubscribers

type Status = 'active' | 'inactive' | 'unsubscribed';

@Schema({ timestamps: true })
export class Newsletter extends Document {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    default: 'active',
    enum: ['active', 'inactive', 'unsubscribed'],
  })
  status: Status;

  @Prop({
    required: false,
    trim: true,
  })
  firstName?: string;

  @Prop({
    required: false,
    trim: true,
  })
  lastName?: string;

  @Prop({
    required: false,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    required: false,
    type: Date,
  })
  verifiedAt?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  lastEmailSentAt?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  unsubscribedAt?: Date;

  @Prop({
    required: false,
    trim: true,
  })
  unsubscribeReason?: string;

  @Prop({
    required: false,
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    required: false,
    type: Object,
    default: {},
  })
  metadata: Record<string, any>;
}

export type NewsletterDocument = HydratedDocument<Newsletter>;

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
