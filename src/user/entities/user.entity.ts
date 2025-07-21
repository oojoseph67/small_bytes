import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, HydratedDocument } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
