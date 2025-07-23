import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Certificate } from './certificate.entity';
import { Course } from './course.entity';

@Schema({ timestamps: true, collection: 'user_certificates' })
export class UserCertificate extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Certificate.name,
    required: true,
  })
  certificateId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  courseId: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  issuedAt: Date;

  @Prop({
    type: String,
    required: true,
  })
  certificateNumber: string;

  @Prop({
    type: Number,
    default: 0,
  })
  xpEarned: number;

  @Prop({
    type: Number,
    required: true,
  })
  finalScore: number; // Average score across all quizzes in the course
}

export type UserCertificateDocument = HydratedDocument<UserCertificate>;

export const UserCertificateSchema = SchemaFactory.createForClass(UserCertificate); 