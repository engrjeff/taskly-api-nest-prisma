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
import { UserEntity } from './entities/user.entity';

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
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() userData: CreateUserDto) {
    const newUser = await this.usersService.createUser(userData);

    return newUser;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse(notFoundResponseSchema)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse(notFoundResponseSchema)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: CreateUserDto,
  ) {
    const user = await this.usersService.getUser({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.usersService.updateUser(id, userData);

    return updatedUser;
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
