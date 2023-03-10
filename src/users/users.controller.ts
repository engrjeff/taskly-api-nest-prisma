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
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

import { hashPassword } from './../auth/utils/auth.utils';
import { JwtAuthGuard } from './../auth/strategies/jwt-auth.guard';
import { exlude } from '../lib';

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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUsers() {
    const users = await this.usersService.getUsers();
    return users.map((u) => exlude(u, ['password']));
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get Tasks of a User' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUserTasks(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const userTasks = await this.usersService.getUser({
      where: { id },
      select: {
        tasks: true,
      },
    });

    return userTasks;
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
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
  @ApiOperation({ summary: 'Get a User by Id' })
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
  @ApiOperation({ summary: 'Update a user' })
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
  @ApiOperation({ summary: 'Delete a user' })
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
