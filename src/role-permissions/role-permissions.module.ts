import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsController } from './role-permissions.controller';
import {
  RolePermission,
  RolePermissionSchema,
} from './entities/role-permission.entity';

@Module({
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  imports: [
    MongooseModule.forFeature([
      { name: RolePermission.name, schema: RolePermissionSchema },
    ]),
  ],
  exports: [RolePermissionsService, MongooseModule],
})
export class RolePermissionsModule {}
