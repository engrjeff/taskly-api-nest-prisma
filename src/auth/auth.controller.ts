import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpCode,
} from '@nestjs/common';

import { LocalAuthGuard } from './strategies/local-auth.guard';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UserEntity } from './../users/entities/user.entity';
import { AuthService } from './auth.service';

class LoginDto {
  @ApiProperty({ example: 'admin@email.com' })
  readonly email: string;

  @ApiProperty({ example: 'mysecuredpassword' })
  readonly password: string;
}

class LoginResponse {
  @ApiProperty({ example: 'some_json_web_token' })
  readonly access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logs in a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponse })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: 'Signs up a user' })
  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }
}
