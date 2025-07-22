import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.entity';
import { Certificate } from './certificate.entity';

@Schema({ timestamps: true, collection: 'course' })
export class Course extends Document {
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
  category: string;

  @Prop([
    {
      type: Types.ObjectId,
      ref: Lesson.name,
    },
  ])
  lessons?: Lesson[];

  @Prop({
    type: Types.ObjectId,
    ref: Certificate.name,
  })
  certificate?: Types.ObjectId;
}

export type CourseDocument = HydratedDocument<Course>;

export const CourseSchema = SchemaFactory.createForClass(Course);
