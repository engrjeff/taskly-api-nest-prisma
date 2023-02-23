import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePasswords, hashPassword } from './utils/auth.utils';
import { UsersService } from './../users/users.service';
import { UserWithoutPassword } from './../users/entities/user.entity';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { exlude } from '../lib';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.getUser({ where: { email } });
    // validate password
    const passwordsMatch = await comparePasswords(pass, user.password);

    if (user && passwordsMatch) {
      return exlude(user, ['password']);
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto) {
    // hash the password
    const hashedPassword = await hashPassword(user.password);

    const newUser = await this.usersService.createUser({
      ...user,
      password: hashedPassword,
    });

    return exlude(newUser, ['password']);
  }
}
