import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';
import { LoginEmailDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login with email and password
  @Post('login-email')
  async loginWithEmail(@Body() loginDto: LoginEmailDto) {
    const { email, password } = loginDto;
    return this.authService.loginWithEmail(email, password);
  }

  @Post('refresh-token')
  @Auth()
  async checkAuthStatus(@Query('_id') _id: string) {
    return this.authService.checkAuthStatus(_id);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @Get('test')
  @Auth(ValidRoles.admin)
  privateRoute() {
    return { hello: 'world' };
  }
}
