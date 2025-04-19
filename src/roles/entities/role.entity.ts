import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query, Types } from 'mongoose';

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

const excludeDeletedMiddleware = function (this: Query<any, any>, next) {
  if (this.getOptions().withDeleted !== true) {
    this.where({ deletedAt: null });
  }
  next();
};

RoleSchema.pre('find', excludeDeletedMiddleware);
RoleSchema.pre('findOne', excludeDeletedMiddleware);
RoleSchema.pre('countDocuments', excludeDeletedMiddleware);
RoleSchema.pre('findOneAndDelete', excludeDeletedMiddleware);
RoleSchema.pre('findOneAndUpdate', excludeDeletedMiddleware);
RoleSchema.pre('updateOne', excludeDeletedMiddleware);
RoleSchema.pre('updateMany', excludeDeletedMiddleware);

RoleSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);
