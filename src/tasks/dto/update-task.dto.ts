import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus, TaskStatusType } from '../entities/task.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ example: 'In Progress' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(TaskStatus)
  readonly status: TaskStatusType;
}
