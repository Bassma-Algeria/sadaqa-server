import { UseCase } from '../UseCase';
import { ActivateAssociationAccountUseCaseRequest } from './ActivateAssociationAccountUseCaseRequest';

import { AccountId } from '../../domain/AccountId';

import { AssociationAccountRepository } from '../../domain/services/AccountRepository/AssociationAccountRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class ActivateAssociationAccountUseCase
    implements UseCase<ActivateAssociationAccountUseCaseRequest, void>
{
    constructor(private readonly associationAccountRepository: AssociationAccountRepository) {}

    async handle(request: ActivateAssociationAccountUseCaseRequest): Promise<void> {
        const associationAccount = await this.associationAccountRepository.findById(
            new AccountId(request.accountId),
        );

        if (!associationAccount) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);

        associationAccount.activate();

        await this.associationAccountRepository.update(associationAccount);
    }
}

export { ActivateAssociationAccountUseCase };
