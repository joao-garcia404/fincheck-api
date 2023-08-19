import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }

  async findUnique(findUnique: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(findUnique);
  }
}
