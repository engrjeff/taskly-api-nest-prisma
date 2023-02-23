import { Task } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const TaskStatus = ['To Do', 'In Progress', 'Paused', 'Done'] as const;

export type TaskStatusType = (typeof TaskStatus)[number];

export class TaskEntity implements Task {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Learn NestJs' })
  title: string;

  @ApiProperty({ example: 'Learn NestJs through its docs' })
  description: string;

  @ApiProperty({ example: 'To Do' })
  status: TaskStatusType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
