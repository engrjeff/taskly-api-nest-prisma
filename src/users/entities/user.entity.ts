import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Wick' })
  name: string;

  @ApiProperty({ example: 'johnwick@email.com' })
  email: string;

  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;
