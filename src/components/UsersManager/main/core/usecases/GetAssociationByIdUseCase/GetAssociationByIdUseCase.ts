import { UseCase } from '../UseCase';
import { GetAssociationByIdUseCaseRequest } from './GetAssociationByIdUseCaseRequest';
import { GetAssociationByIdUseCaseResponse } from './GetAssociationByIdUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { AssociationAccount } from '../../domain/AssociationAccount';

import { AssociationAccountRepository } from '../../domain/services/AssociationAccountRepository';
import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';

class GetAssociationByIdUseCase
  implements UseCase<GetAssociationByIdUseCaseRequest, GetAssociationByIdUseCaseResponse>
{
  constructor(private readonly associationAccountRepository: AssociationAccountRepository) {}

  async handle({
    associationId,
  }: GetAssociationByIdUseCaseRequest): Promise<GetAssociationByIdUseCaseResponse> {
    const account = await this.associationAccountRepository.findById(new UserId(associationId));

    if (!account) throw new UserNotFoundException();

    return this.getResponse(account);
  }

  private getResponse(account: AssociationAccount): GetAssociationByIdUseCaseResponse {
    return {
      associationId: account.associationId.value(),
      associationName: account.associationName.value(),
      email: account.email.value(),
      wilayaNumber: account.wilayaNumber.value(),
      phoneNumber: account.phone.value(),
      createdAt: account.createdAt,
      active: account.active,
    };
  }
}

export { GetAssociationByIdUseCase };