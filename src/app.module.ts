import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/env.config';

@Module({
  imports: [
    //Prepare environment variables
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB),
    UserModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('proccess.env :>> ', process.env);
  }
}
