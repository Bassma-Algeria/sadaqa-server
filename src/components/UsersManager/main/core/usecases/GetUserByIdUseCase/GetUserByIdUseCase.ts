import { UseCase } from '../UseCase';
import { GetUserByIdUseCaseRequest } from './GetUserByIdUseCaseRequest';
import { GetUserByIdUseCaseResponse } from './GetUserByIdUseCaseResponse';

import { UserId } from '../../domain/UserId';

import { UserAccountRepository } from '../../domain/services/UserAccountRepository';

import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';
import { UserAccount } from '../../domain/UserAccount';

class GetUserByIdUseCase implements UseCase<GetUserByIdUseCaseRequest, GetUserByIdUseCaseResponse> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async handle(request: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const userId = new UserId(request.userId);

    const userAccount = await this.userAccountRepository.findById(userId);
    if (!userAccount) throw new UserNotFoundException();

    return this.getResponse(userAccount);
  }

  private getResponse(userAccount: UserAccount): GetUserByIdUseCaseResponse {
    return {
      userId: userAccount.userId.value(),
      firstName: userAccount.firstName.value(),
      lastName: userAccount.lastName.value(),
      wilayaNumber: userAccount.wilayaNumber.value(),
      phoneNumber: userAccount.phone.value(),
      email: userAccount.email.value(),
      createdAt: userAccount.createdAt,
    };
  }
}

export { GetUserByIdUseCase };
