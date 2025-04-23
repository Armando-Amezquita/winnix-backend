import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/modules/common.module';
import { EnvConfiguration } from './config/env.config';
import { SocketsModule } from './modules/sockets/sockets.module';
import { RolesModule } from './roles/roles.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { AccountSettingsModule } from './account-settings/account-settings.module';

@Module({
  imports: [
    //Prepare environment variables
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    UserModule,
    CommonModule,
    SocketsModule,
    RolesModule,
    AccountSettingsModule,
    RolePermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
