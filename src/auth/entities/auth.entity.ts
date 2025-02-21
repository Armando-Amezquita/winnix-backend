import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type AuthDocument = HydratedDocument<Auth>;

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  QR = 'qr',
}

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, enum: AuthProvider })
  provider: AuthProvider;

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ required: false })
  externalId?: string;

  @Prop({ required: false })
  qrToken?: string;

  async hashPassword() {
    if (this.passwordHash) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
  }
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// Middleware para hashear contraseñas antes de guardar
AuthSchema.pre<AuthDocument>('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});
