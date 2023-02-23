import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './strategies/local-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
