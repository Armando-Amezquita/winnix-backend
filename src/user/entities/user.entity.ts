import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ValidRoles } from 'src/auth/interfaces';
// import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  email: string;

  @Prop({ index: true, trim: true })
  nickname: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Auth' }] })
  authMethods: Types.ObjectId[];

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

  @Prop({
    required: true,
    default: ValidRoles.user,
  })
  roles: string[];

  //   @Prop({ trim: true })
  //   avatar: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

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

// // Método para comparar contraseñas
// UserSchema.methods.comparePassword = async function (
//   password: string,
// ): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };
