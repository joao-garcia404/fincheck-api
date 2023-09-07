import { Injectable, NotFoundException } from '@nestjs/common';

import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  public async validate(userId: string, transactionId: string) {
    const isOwner = await this.transactionsRepository.findFirst({
      where: {
        userId,
        id: transactionId,
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Transaction not found.');
    }
  }
}
