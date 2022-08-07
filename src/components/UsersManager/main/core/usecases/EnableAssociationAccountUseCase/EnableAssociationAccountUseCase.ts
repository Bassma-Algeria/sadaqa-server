import { UseCase } from '../UseCase';
import { EnableAssociationAccountUseCaseRequest } from './EnableAssociationAccountUseCaseRequest';

import { AccountId } from '../../domain/AccountId';
import { AssociationAccount } from '../../domain/AssociationAccount';

import { AssociationAccountRepository } from '../../domain/services/AccountRepository/AssociationAccountRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class EnableAssociationAccountUseCase
    implements UseCase<EnableAssociationAccountUseCaseRequest, void>
{
    constructor(private readonly associationAccountRepository: AssociationAccountRepository) {}

    async handle(request: EnableAssociationAccountUseCaseRequest): Promise<void> {
        const associationAccount = await this.associationAccountRepository.findById(
            new AccountId(request.accountId),
        );

        if (!associationAccount) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);

        const enabledAccount = associationAccount.enable() as AssociationAccount;

        await this.associationAccountRepository.update(enabledAccount);
    }
}

export { EnableAssociationAccountUseCase };
