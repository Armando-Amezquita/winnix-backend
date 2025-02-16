import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'The name must be at least 3 characters long' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(30, { message: 'The password must not exceed 20 characters' })
  //   @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
  //     message: 'The password must contain at least one letter and one number',
  //   })
  password: string;

  //   idNumber: string;

  //   country: string;

  //   neighborhood: string;

  //   birthDate: Date;

  //   phoneNumber: string;
}
