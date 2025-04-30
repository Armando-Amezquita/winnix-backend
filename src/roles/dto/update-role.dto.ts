import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['name'] as const),
) {}

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];
}
