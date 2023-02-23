import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TaskStatusType } from '../entities/task.entity';

export class GetTasksQuery {
  @IsOptional()
  readonly status?: TaskStatusType;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  readonly limit?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  readonly offset?: number;
}
