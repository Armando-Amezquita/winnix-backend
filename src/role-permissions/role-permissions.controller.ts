import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import {
  createPaginatedSuccessResponse,
  createSuccessResponse,
} from 'src/common/helpers/responses/response-helper';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  async createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    const response = await this.rolePermissionsService.createRp(
      createRolePermissionDto,
    );
    return createSuccessResponse(response, 'Permission created successfully');
  }

  @Get()
  async findPermissions(
    @Query('term') term?: string,
    @Query('field') field?: string,
  ) {
    const response = await this.rolePermissionsService.findRpByTerm(
      term,
      field,
    );

    return createPaginatedSuccessResponse(response);
  }

  @Get(':id')
  async findRpById(@Param('id') id: string) {
    const response = await this.rolePermissionsService.findByIdRp(id);
    return createSuccessResponse(response);
  }

  @Patch(':id')
  async updateRolePermission(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    const response = await this.rolePermissionsService.updateRp(
      id,
      updateRolePermissionDto,
    );
    return createSuccessResponse(response);
  }
}
