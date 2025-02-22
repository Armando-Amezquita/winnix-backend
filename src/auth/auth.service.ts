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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 Login con email y contraseña
  async loginWithEmail(email: string, password: string) {
    email = email.toLowerCase();
    const user = await this.userService.findByEmail(email);
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

    return {
      ...user.toObject(),
      token: this.getJwtToken({
        _id: user._id.toString(),
        email: user.email,
      }),
    };
  }

  async signup(signupDto: SignUpDto) {
    const { email, password, ...res } = signupDto;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new ConflictException('Email is already registered');

    const newUser = await this.userService.createUser({ email, ...res });

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

    return {
      ...newUser.toObject(),
      token: this.getJwtToken({
        _id: newUser._id.toString(),
        email: newUser.email,
      }),
    };
  }

  async checkAuthStatus(_id: string) {
    const user = await this.userService.findOneByTermUser(_id);
    if (!user) throw new UnauthorizedException('User no found');

    return {
      ...user.toObject(),
      token: this.getJwtToken({
        _id: user._id.toString(),
        email: user.email,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
