import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query, SchemaTypes, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true, index: true, trim: true })
  username: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ index: true, lowercase: true, trim: true })
  nickname: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Auth' }] })
  authMethods: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Types.ObjectId[];

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: true })
  incremental: number;

  @Prop({ type: Date, default: null, index: true })
  deletedAt?: Date | null;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null, index: true })
  deletedBy?: Types.ObjectId | null;

  @Prop({
    type: {
      accepted: { type: Boolean, required: true, default: true },
      date: { type: Date, required: true, default: Date.now },
      version: { type: String, required: true, default: 'v1.0' },
    },
  })
  terms: { accepted: boolean; date: Date; version: string };

  //   @Prop({ required: true, trim: true })
  //   idNumber: string;

  //   @Prop({ trim: true })
  //   country: string;

  //   @Prop({ trim: true })
  //   neighborhood: string;

  //   @Prop({ required: true, trim: true })
  //   birthDate: Date;

  //   @Prop({ required: true, trim: true })
  //   phoneNumber: string;

  //   @Prop({ trim: true })
  //   avatar: string;

  //   @Prop({ default: 0 })
  //   reputation: number;

  //   @Prop({ trim: true })
  //   subscription: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

const excludeDeletedMiddleware = function (this: Query<any, any>, next) {
  if (this.getOptions().withDeleted !== true) {
    this.where({ deletedAt: null });
  }
  next();
};

UserSchema.pre('find', excludeDeletedMiddleware);
UserSchema.pre('findOne', excludeDeletedMiddleware);
UserSchema.pre('countDocuments', excludeDeletedMiddleware);
UserSchema.pre('findOneAndDelete', excludeDeletedMiddleware);
UserSchema.pre('findOneAndUpdate', excludeDeletedMiddleware);
UserSchema.pre('updateOne', excludeDeletedMiddleware);
UserSchema.pre('updateMany', excludeDeletedMiddleware);

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);

UserSchema.index(
  { incremental: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);
