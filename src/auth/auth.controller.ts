import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login with email and password
  @Post('login-email')
  async loginWithEmail(@Body() loginDto: LoginEmailDto) {
    const { email, password } = loginDto;
    return this.authService.loginWithEmail(email, password);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }
}
