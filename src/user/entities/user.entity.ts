import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
// import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  email: string;

  @Prop({ index: true, trim: true })
  nickname: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Auth' }] })
  authMethods: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Types.ObjectId[];

  @Prop({ required: true, default: true })
  isActive: boolean;

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

UserSchema.pre<UserDocument>('save', async function (next) {
  this.email = this.email.toLowerCase();
  next();
});
