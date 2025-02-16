import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  email: string;

  @Prop({ index: true, trim: true })
  nickname: string;

  @Prop({ required: true, trim: true })
  password: string;

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

  //   @Prop({
  //     required: true,
  //     default: 'player',
  //     type: MongooseSchema.Types.ObjectId,
  //     ref: 'Role',
  //   })
  //   role: MongooseSchema.Types.ObjectId;

  //   @Prop({ trim: true })
  //   avatar: string;

  //   @Prop({ required: true, default: true })
  //   isActive: boolean;

  //   @Prop({ default: 0 })
  //   reputation: number;

  //   @Prop({ trim: true })
  //   subscription: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware para hashear la contraseña antes de guardar el usuario
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Genera el salt
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
