import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }

  async getUser(args?: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(args);
  }

  async createUser(user: CreateUserDto) {
    return this.prisma.user.create({ data: user });
  }

  async updateUser(id: number, user: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
