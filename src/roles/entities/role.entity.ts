import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  label?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'RolePermission' }],
    default: [],
  })
  permissions: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'RoleConfig' })
  config?: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
