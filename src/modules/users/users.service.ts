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
    });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      name: user.name,
      email: user.email,
    };
  }
}
