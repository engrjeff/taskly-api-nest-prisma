import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Wick' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @ApiProperty({ example: 'johnwick@sample.com' })
  @IsString()
  @IsEmail(undefined, { message: 'Provide a valid email' })
  readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
