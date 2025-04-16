import {
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3, {
    message: 'The role name must be at least 3 characters long.',
  })
  @MaxLength(30, {
    message: 'The role name must not exceed 30 characters.',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(7, {
    message: 'The label must be at least 7 characters long.',
  })
  @MaxLength(50, {
    message: 'The label must not exceed 50 characters.',
  })
  label?: string;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array of IDs.' })
  @IsMongoId({
    each: true,
    message: 'Each permission must be a valid MongoDB ObjectId.',
  })
  permissions?: string[];

  @IsOptional()
  @IsMongoId({ message: 'The config ID must be a valid MongoDB ObjectId.' })
  config?: string;
}
