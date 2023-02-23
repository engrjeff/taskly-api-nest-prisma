import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Body,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

import { hashPassword } from './../auth/utils/auth.utils';
import { JwtAuthGuard } from './../auth/strategies/jwt-auth.guard';

// a helper function for removing a property from an object
function exlude<T, Key extends keyof T>(data: T, keys: Key[]): Omit<T, Key> {
  for (const key of keys) {
    delete data[key];
  }
  return data;
}

const notFoundResponseSchema: ApiResponseOptions = {
  schema: {
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
    },
  },
};

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUsers() {
    const users = await this.usersService.getUsers();
    return users.map((u) => exlude(u, ['password']));
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() userData: CreateUserDto) {
    // hash the password
    const hashedPassword = await hashPassword(userData.password);

    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return exlude(newUser, ['password']);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse(notFoundResponseSchema)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return exlude(user, ['password']);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse(notFoundResponseSchema)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.usersService.updateUser(id, userData);

    return exlude(updatedUser, ['password']);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ApiNotFoundResponse(notFoundResponseSchema)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.usersService.deleteUser(id);
  }
}
