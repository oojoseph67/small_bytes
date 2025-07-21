import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

@Schema()
class Permission {
  @Prop({
    required: true,
    enum: Resource,
  })
  resource: Resource;

  @Prop({
    required: true,
    type: [
      {
        type: String,
        enum: Action,
      },
    ],
  })
  actions: Action[];
}

@Schema()
export class Roles extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    type: [Permission],
  })
  permissions: Permission[];
}

export type RolesDocument = HydratedDocument<Roles>;

export const RolesSchema = SchemaFactory.createForClass(Roles);
