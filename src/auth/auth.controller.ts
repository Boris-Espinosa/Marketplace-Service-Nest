import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { type Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() { user }) {
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  logout(@Req() req: Request) {
    return req.logout;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Req() { user }) {
    return user;
  }
}
