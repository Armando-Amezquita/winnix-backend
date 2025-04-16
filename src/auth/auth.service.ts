import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AuthProvider, AuthDocument, Auth } from './entities/auth.entity';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { LoginEmailDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 Login con email y contraseña
  async loginWithEmail(payload: LoginEmailDto) {
    try {
      const { email, password } = payload;
      const emailMap = email.toLowerCase();
      const user = await this.userService.findByEmail(emailMap);
      if (!user)
        throw new UnauthorizedException(
          'Invalid credentials. If you forgot your password, you can reset it.',
        );

      const auth = await this.authModel.findOne({
        user: user?._id,
        provider: AuthProvider.EMAIL,
      });

      if (!auth || !auth.passwordHash)
        throw new UnauthorizedException(
          'Invalid authentication method. Please try a different login method.',
        );

      const isMatch = await bcrypt.compare(password, auth.passwordHash);
      if (!isMatch)
        throw new UnauthorizedException(
          'Invalid credentials. If you forgot your password, you can reset it.',
        );

      const payloadToken = this.mapDataByToken(user);
      return {
        token: this.getJwtToken(payloadToken),
      };
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  async signup(signupDto: SignUpDto) {
    const { email, password, username } = signupDto;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new ConflictException('Email is already registered');

    const newUser = await this.userService.createUser({ email, username });

    const auth = new this.authModel({
      user: newUser._id,
      provider: AuthProvider.EMAIL,
      passwordHash: password,
    });
    await auth.save();

    // Ensure that auth._id is an ObjectId.
    if (!auth._id || !(auth._id instanceof Types.ObjectId)) {
      throw new InternalServerErrorException(
        'Failed to generate authentication method ID.',
      );
    }

    // Update user to added authentication method
    newUser.authMethods.push(auth._id);
    await newUser.save();

    const payloadToken = this.mapDataByToken(newUser);
    return {
      token: this.getJwtToken(payloadToken),
    };
  }

  async checkAuthStatus(_id: string) {
    const user = await this.userService.findOneByTermUser(_id);
    if (!user) throw new UnauthorizedException('User no found');

    const payloadToken = this.mapDataByToken(user);

    return {
      token: this.getJwtToken(payloadToken),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private mapDataByToken(user: any): JwtPayload {
    return {
      _id: user._id.toString(),
      email: user.email,
      isActive: user.isActive,
      roles: user.roles,
      username: user.username,
    };
  }
}
