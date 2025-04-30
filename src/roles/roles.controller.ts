import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRolePermissionsDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.rolesService.findOneRoleByTerm(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Patch('role/:name')
  updateRolePermission(
    @Param('name') nameRole: string,
    @Body() nameRP: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissionRole(nameRole, nameRP);
  }
}
