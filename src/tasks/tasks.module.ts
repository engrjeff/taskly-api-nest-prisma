import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from './../prisma.service';
import { UsersService } from './../users/users.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, UsersService],
})
export class TasksModule {}
