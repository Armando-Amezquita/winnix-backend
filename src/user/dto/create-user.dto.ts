import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'The name must be at least 3 characters long' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  //   idNumber: string;

  //   country: string;

  //   neighborhood: string;

  //   birthDate: Date;

  //   phoneNumber: string;
}
