import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, HydratedDocument, Types } from 'mongoose';

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

  @Prop({
    type: Types.ObjectId,
    ref: 'roles'
  })
  roleId: Types.ObjectId
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
