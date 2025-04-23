import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { CommonModule } from 'src/common/modules/common.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
