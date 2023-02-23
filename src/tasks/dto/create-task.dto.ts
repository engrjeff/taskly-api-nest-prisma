import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Invalid user' })
  readonly userId: number;

  @ApiProperty({ example: 'Learn NestJs' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: 'Learn NestJs through its docs' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
