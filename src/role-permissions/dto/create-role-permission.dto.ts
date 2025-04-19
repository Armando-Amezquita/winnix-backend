import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateRolePermissionDto {
  @IsString()
  @MinLength(7, {
    message: 'The role name must be at least 7 characters long.',
  })
  @MaxLength(30, { message: 'The role name must not exceed 30 characters.' })
  name: string;

  @IsString()
  @MinLength(7, {
    message: 'The description must be at least 7 characters long.',
  })
  @MaxLength(50, { message: 'The description must not exceed 50 characters.' })
  description: string;
}
