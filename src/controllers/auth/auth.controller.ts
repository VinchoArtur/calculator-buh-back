import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: { username: string; password: string }): boolean {
    const { username, password } = credentials;
    try {
      return this.authService.validateUser(username, password);
    } catch (error) {
      throw error;
    }
  }
}
