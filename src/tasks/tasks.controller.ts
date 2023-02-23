import { JwtAuthGuard } from './../auth/strategies/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { GetTasksQuery } from './dto/get-tasks-query.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { UsersService } from './../users/users.service';
import { TaskEntity } from './entities/task.entity';

@ApiBearerAuth()
@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: TaskEntity })
  async create(@Body() createTaskDto: CreateTaskDto) {
    const foundUser = await this.usersService.getUser({
      where: { id: createTaskDto.userId },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, type: String, example: 'To Do' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 1 })
  @ApiOkResponse({ type: TaskEntity, isArray: true })
  async findAll(@Query() query: GetTasksQuery) {
    return this.tasksService.findAll({
      where: {
        status: query.status,
      },
      skip: query.offset,
      take: query.limit,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findOne(id);

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.findOne(id);

    if (!task) throw new NotFoundException('Task not found');

    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findOne(id);

    if (!task) throw new NotFoundException('Task not found');

    return this.tasksService.remove(id);
  }
}
