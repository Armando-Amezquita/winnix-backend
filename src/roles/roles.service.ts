import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRolePermissionsDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './entities/role.entity';
import { RolePermissionsService } from 'src/role-permissions/role-permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly rPService: RolePermissionsService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    try {
      return await this.roleModel.create(createRoleDto);
    } catch (error) {
      console.log('error :>> ', error);
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        const duplicatedValue = error.keyValue[duplicatedField];

        throw new BadRequestException(
          `A role with the ${duplicatedField} "${duplicatedValue}" already exists. Please use a different ${duplicatedField}.`,
        );
      }

      throw new InternalServerErrorException(`Can't create role`);
    }
  }

  async findAllRoles() {
    try {
      return await this.roleModel.find({});
    } catch (error) {
      console.log('error findAll roles:>> ', error);
      throw new InternalServerErrorException(`Can't get all roles`);
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      return await this.roleModel.findByIdAndUpdate(id, updateRoleDto);
    } catch (error) {
      console.log('error updateRole roles:>> ', error);
      throw new InternalServerErrorException(`Can't update roles`);
    }
  }

  async updatePermissionRole(
    nameRole: string,
    nameRP: UpdateRolePermissionsDto,
  ) {
    const permissionsFound = await this.rPService.findRpByTerms(
      nameRP.permissions,
    );

    if (!permissionsFound || permissionsFound.length === 0) {
      throw new NotFoundException('No se encontraron permisos válidos.');
    }

    const permissionIds = permissionsFound.map((perm) => perm._id);
    const updatedRole = await this.roleModel.findOneAndUpdate(
      { name: nameRole },
      { $addToSet: { permissions: { $each: permissionIds } } },
      { new: true },
    );

    if (!updatedRole) {
      throw new NotFoundException(
        `No permission found with identifier: '${nameRole}'`,
      );
    }

    return updatedRole;
  }

  async findOneRoleByTerm(term: string): Promise<RoleDocument> {
    const query = isValidObjectId(term)
      ? { _id: term }
      : { $or: [{ name: term }, { label: term }] };

    const role: RoleDocument = await this.roleModel.findOne(query).exec();

    if (!role)
      throw new NotFoundException(`No role found with identifier: "${term}"`);

    return role;
  }
}
