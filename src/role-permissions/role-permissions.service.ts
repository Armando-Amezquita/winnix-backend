import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import {
  RolePermission,
  RolePermissionDocument,
} from './entities/role-permission.entity';
import { BaseRepository } from 'src/common/database/base-repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResponse } from 'src/common/interfaces/pagination-response.interface';

@Injectable()
export class RolePermissionsService extends BaseRepository<RolePermissionDocument> {
  constructor(
    @InjectModel(RolePermission.name)
    private readonly rpModel: Model<RolePermissionDocument>,
  ) {
    super(rpModel);
  }

  async createRp(createRolePermissionDto: CreateRolePermissionDto) {
    const response = await super.create(createRolePermissionDto);
    return response;
  }

  async findAllRp(
    paginationDto: PaginationDto,
    filter: FilterQuery<RolePermissionDocument> = {},
    projection?: ProjectionType<RolePermissionDocument> | null,
    options?: QueryOptions<RolePermissionDocument> | null,
  ): Promise<IPaginatedResponse<Partial<RolePermissionDocument>>> {
    return super.paginate(filter, paginationDto, projection, options);
  }

  async findByIdRp(id: string): Promise<RolePermissionDocument> {
    const projection = { deletedAt: 0, deletedBy: 0 };
    return await super.findById(id, projection);
  }

  async findRpByTerm(
    term?: string,
    field?: string,
    paginationDto?: PaginationDto,
    projection?: ProjectionType<RolePermissionDocument> | null,
    options?: QueryOptions<RolePermissionDocument> | null,
  ): Promise<IPaginatedResponse<Partial<RolePermissionDocument>>> {
    const response = await super.paginateByTerm(
      term,
      field,
      paginationDto,
      projection,
      options,
    );
    if (!response)
      throw new NotFoundException(
        `No permission found with identifier: "${term}"`,
      );

    return response;
  }

  async updateRp(id: string, updateRolePermissionDto: UpdateRolePermissionDto) {
    const response = await super.update(id, updateRolePermissionDto);
    if (!response)
      throw new NotFoundException(`No permission found with id: "${id}"`);

    return response;
  }
}
