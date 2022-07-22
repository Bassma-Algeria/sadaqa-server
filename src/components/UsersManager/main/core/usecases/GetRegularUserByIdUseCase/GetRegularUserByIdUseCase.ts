import { UseCase } from '../UseCase';
import { GetRegularUserByIdUseCaseRequest } from './GetRegularUserByIdUseCaseRequest';
import { GetRegularUserByIdUseCaseResponse } from './GetRegularUserByIdUseCaseResponse';

import { UserId } from '../../domain/UserId';

import { RegularUserAccountRepository } from '../../domain/services/RegularUserAccountRepository';

import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';
import { RegularUserAccount } from '../../domain/RegularUserAccount';

class GetRegularUserByIdUseCase
  implements UseCase<GetRegularUserByIdUseCaseRequest, GetRegularUserByIdUseCaseResponse>
{
  constructor(private readonly userAccountRepository: RegularUserAccountRepository) {}

  async handle(
    request: GetRegularUserByIdUseCaseRequest,
  ): Promise<GetRegularUserByIdUseCaseResponse> {
    const userId = new UserId(request.regularUserId);

    const userAccount = await this.userAccountRepository.findById(userId);
    if (!userAccount) throw new UserNotFoundException();

    return this.getResponse(userAccount);
  }

  private getResponse(userAccount: RegularUserAccount): GetRegularUserByIdUseCaseResponse {
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

export { GetRegularUserByIdUseCase };
