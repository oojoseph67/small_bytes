import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class GlossaryTerm extends Document {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  term: string;

  @Prop({
    required: true,
  })
  definition: string;

  @Prop()
  abbreviation: string;

  @Prop([String])
  relatedTerms: string[];

  @Prop({
    default: 0,
  })
  searchCount: number;

  @Prop([String])
  categories: string[];
}

export type GlossaryTermDocument = HydratedDocument<GlossaryTerm>;

export const GlossaryTermSchema = SchemaFactory.createForClass(GlossaryTerm);
