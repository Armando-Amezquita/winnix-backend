import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3, { message: 'The name must be at least 3 characters long' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(7, { message: 'The password must be at least 7 characters long' })
  @MaxLength(30, { message: 'The password must not exceed 30 characters' })
  password: string;
}
