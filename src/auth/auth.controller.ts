import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';

import { LocalAuthGuard } from './strategies/local-auth.guard';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UserEntity } from './../users/entities/user.entity';
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

  @ApiCreatedResponse({ type: UserEntity })
  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }
}
