import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(findMany: Prisma.CategoryFindManyArgs) {
    return this.prismaService.category.findMany(findMany);
  }
}