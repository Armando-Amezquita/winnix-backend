import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './entities/role.entity';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RolePermissionsModule,
  ],
  exports: [RolesService, MongooseModule],
})
export class RolesModule {}
