import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from 'src/shared/database/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string) {
    const user = await this.usersRepository.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
