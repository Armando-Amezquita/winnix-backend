import { IsEmail, IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { AuthProvider } from '../entities/auth.entity';

// 🔹 DTO para login con email y contraseña
export class LoginEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

// 🔹 DTO para login con redes sociales
export class LoginSocialDto {
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}

// 🔹 DTO para login con QR
export class LoginQrDto {
  @IsString()
  @IsNotEmpty()
  qrToken: string;
}
