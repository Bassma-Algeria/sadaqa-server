import { UseCase } from '../UseCase';
import { ActivateAssociationAccountUseCaseRequest } from './ActivateAssociationAccountUseCaseRequest';

import { UserId } from '../../domain/UserId';

import { AssociationAccountRepository } from '../../domain/services/AssociationAccountRepository';
import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';

class ActivateAssociationAccountUseCase
  implements UseCase<ActivateAssociationAccountUseCaseRequest, void>
{
  constructor(private readonly associationAccountRepository: AssociationAccountRepository) {}

  async handle(request: ActivateAssociationAccountUseCaseRequest): Promise<void> {
    const associationAccount = await this.associationAccountRepository.findById(
      new UserId(request.associationId),
    );

    if (!associationAccount) throw new UserNotFoundException();

    const activatedAccount = associationAccount.activate();

    await this.associationAccountRepository.update(activatedAccount);
  }
}

export { ActivateAssociationAccountUseCase };